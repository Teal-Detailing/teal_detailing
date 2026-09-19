import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { getAllPosts, getPostBySlug, validateFrontmatter, BLOG_DIR } from "@/lib/blog";
import { getCityBySlug } from "@/lib/cities";
import {
  SITE, addSkippedJob, approvalKeyboard, commitAndPush, downloadTelegramFile, getPhoto, hashJobId,
  listJobs, listPhotos, readState, retryKeyboard, sendDocument, sendPhotos, sendText, toWebJpeg,
  todayEastern, trySendText, type Job, type JobPhoto,
} from "./lib";
import { writeDraft, type Draft } from "./writer";

// How many candidate jobs one run will try before giving up - bounds model
// spend when several recent jobs turn out to have unusable photos.
const MAX_JOBS_PER_RUN = 3;
const MIN_WORDS = 400;

type DraftMeta = { slug: string; jobHash: string; folderId: string; before: string; after: string };

type Payload = { action?: string; job?: string; docFileId?: string };

// ------------------------------------------------------------------ draft

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

function uniqueSlug(base: string): string {
  let slug = base || `case-study-${todayEastern()}`;
  for (let n = 2; fs.existsSync(path.join(BLOG_DIR, `${slug}.mdx`)); n++) slug = `${base}-${n}`;
  return slug;
}

// A final guard on what the model returned, independent of the prompt.
function checkDraft(draft: Draft, photoCount: number) {
  const inRange = (n: number) => Number.isInteger(n) && n >= 1 && n <= photoCount;
  if (!inRange(draft.beforePhoto) || !inRange(draft.afterPhoto) || draft.beforePhoto === draft.afterPhoto) {
    throw new Error("The model picked invalid photo numbers");
  }
  for (const marker of ["{{BEFORE_IMAGE}}", "{{AFTER_IMAGE}}"]) {
    if (draft.body.split(marker).length !== 2) throw new Error(`The post must contain ${marker} exactly once`);
  }
  const words = draft.body.trim().split(/\s+/).length;
  if (words < MIN_WORDS) throw new Error(`The post is too short (${words} words)`);
  if (/\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/.test(draft.body)) {
    throw new Error("The post contains a phone number");
  }
}

function buildMdx(draft: Draft, meta: DraftMeta): string {
  const img = (name: "before" | "after") => `/images/blog/${meta.slug}/${name}.jpg`;
  const body = draft.body
    .replace("{{BEFORE_IMAGE}}", `![${draft.beforeAlt}](${img("before")})`)
    .replace("{{AFTER_IMAGE}}", `![${draft.afterAlt}](${img("after")})`);

  const data: Record<string, unknown> = {
    title: draft.title,
    date: todayEastern(),
    excerpt: draft.excerpt,
    category: "case-study",
    author: "Teal Detailing",
    image: img("after"),
    imageAlt: draft.afterAlt,
    relatedServices: draft.relatedServices,
    relatedCities: draft.relatedCities,
    keywords: draft.keywords,
    faqs: draft.faqs,
    sourceJob: meta.jobHash,
    // Everything publish needs to rebuild the post exactly as approved.
    // Stripped before the file is committed.
    _draft: meta,
  };
  return matter.stringify(`\n${body.trim()}\n`, data);
}

// Telegram shows the draft as plain text so it can be read in the chat before
// deciding - markdown syntax that would just be noise there is flattened.
function readable(draft: Draft): string[] {
  const text = [
    draft.title.toUpperCase(),
    draft.excerpt,
    draft.body
      .replace(/^\{\{(BEFORE|AFTER)_IMAGE\}\}$/gm, (_, which) => `[${which.toLowerCase()} photo]`)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^#{2,3}\s+(.*)$/gm, (_, heading) => `\n■ ${heading}`),
    draft.faqs.length ? "FAQ\n" + draft.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const chunks: string[] = [];
  let current = "";
  for (const para of text.split(/\n{2,}/)) {
    if (current && current.length + para.length + 2 > 3800) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current}\n\n${para}` : para;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function draftFromJob(job: Job, photos: JobPhoto[]): Promise<"sent" | "unusable"> {
  const jobHash = hashJobId(job.jobId);
  const posts = getAllPosts();
  const example = posts.find((p) => p.category === "case-study") ?? posts[0];
  const examplePost = example ? getPostBySlug(example.slug)?.content ?? "" : "";

  console.log(`Drafting from job ${jobHash} with ${photos.length} photos`);
  const draft = await writeDraft({ job, photos, existingTitles: posts.map((p) => p.title), examplePost });

  if (!draft.usable) {
    console.log(`Job ${jobHash} judged unusable`);
    await sendText(`ℹ️ Passed over a ${job.vehicleType || "job"} from ${job.date || "recently"}: ${draft.unusableReason}`);
    return "unusable";
  }
  checkDraft(draft, photos.length);

  const before = photos[draft.beforePhoto - 1];
  const after = photos[draft.afterPhoto - 1];
  const slug = uniqueSlug(slugify(draft.slug || draft.title));
  const meta: DraftMeta = { slug, jobHash, folderId: job.folderId, before: before.id, after: after.id };
  const mdx = buildMdx(draft, meta);

  const parsed = matter(mdx).data;
  delete parsed._draft;
  validateFrontmatter(slug, parsed);

  const [beforeJpg, afterJpg] = await Promise.all([
    getPhoto(job.folderId, before.id).then((b) => toWebJpeg(b, 1600)),
    getPhoto(job.folderId, after.id).then((b) => toWebJpeg(b, 1600)),
  ]);

  const city = draft.relatedCities.map((c) => getCityBySlug(c)?.name).find(Boolean);
  const words = draft.body.trim().split(/\s+/).length;
  const flags = draft.privacyFlags.length
    ? `\n\n⚠️ Check before publishing:\n${draft.privacyFlags.map((f) => `• ${f}`).join("\n")}`
    : "";

  await sendText(`📝 This week's draft — ${[job.vehicleType, job.packageName, city].filter(Boolean).join(" · ")}`);
  await sendPhotos([
    { buffer: beforeJpg, caption: `Before — ${draft.beforeAlt}` },
    { buffer: afterJpg, caption: `After — ${draft.afterAlt}` },
  ]);
  for (const chunk of readable(draft)) await sendText(chunk);
  await sendDocument(
    `${slug}.md`,
    mdx,
    `${draft.title}\n\n${words} words · ${draft.relatedServices.length} service links${flags}\n\nPublish puts it live on ${SITE}/blog in about 3 minutes.`,
    approvalKeyboard(jobHash)
  );
  console.log(`Draft ${slug} sent for approval`);
  return "sent";
}

async function runDraft() {
  const used = new Set<string>([
    ...getAllPosts().map((p) => p.sourceJob).filter((h): h is string => Boolean(h)),
    ...readState().skippedJobs,
  ]);

  const jobs = await listJobs();
  const candidates = jobs.filter((j) => !used.has(hashJobId(j.jobId)));
  console.log(`${jobs.length} jobs with photo folders, ${candidates.length} not yet used`);

  if (!candidates.length) {
    await sendText(
      "📭 No new completed jobs with a before/after photo folder, so no post this week.\n\nAdd a folder link to a job in the sheet, then tap below.",
      retryKeyboard
    );
    return;
  }

  const passedOver: string[] = [];
  let sent = false;
  for (const job of candidates.slice(0, MAX_JOBS_PER_RUN)) {
    const photos = (await listPhotos(job.folderId)).filter((p) => p.thumb);
    if (photos.length < 2) {
      // Not recorded as skipped - photos may still be on their way.
      console.log(`Job ${hashJobId(job.jobId)} has ${photos.length} photos; trying the next job`);
      continue;
    }

    // Thumbnails come from Drive in whatever format it rendered; normalise so
    // the model always gets small JPEGs.
    const normalised = await Promise.all(
      photos.map(async (p) => ({
        ...p,
        thumb: (await toWebJpeg(Buffer.from(p.thumb!, "base64"), 800)).toString("base64"),
      }))
    );

    if ((await draftFromJob(job, normalised)) === "sent") {
      sent = true;
      break;
    }
    const jobHash = hashJobId(job.jobId);
    if (addSkippedJob(jobHash)) passedOver.push(jobHash);
  }

  if (!sent) {
    await sendText(
      `📭 Checked ${Math.min(candidates.length, MAX_JOBS_PER_RUN)} recent job(s) but none had a usable before/after pair, so no post this week.`,
      retryKeyboard
    );
  }

  if (passedOver.length) {
    commitAndPush(
      `Content agent: pass over ${passedOver.length} job(s) with unusable photos [skip netlify]`,
      ["scripts/content-agent/state.json"]
    );
  }
}

// ------------------------------------------------------------------ publish

async function runPublish(docFileId: string) {
  const raw = (await downloadTelegramFile(docFileId)).toString("utf8");
  const { data, content } = matter(raw);
  const meta = data._draft as DraftMeta | undefined;
  if (!meta?.slug) throw new Error("That draft file has no publishing details - was it edited?");
  delete data._draft;

  const postPath = path.join(BLOG_DIR, `${meta.slug}.mdx`);
  if (fs.existsSync(postPath)) {
    await sendText(`Already published: ${SITE}/blog/${meta.slug}`);
    return;
  }

  // The publish date is the day it goes live, not the day it was drafted.
  data.date = todayEastern();
  validateFrontmatter(meta.slug, data);

  const imageDir = path.join(process.cwd(), "public/images/blog", meta.slug);
  const [beforeJpg, afterJpg] = await Promise.all([
    getPhoto(meta.folderId, meta.before).then((b) => toWebJpeg(b, 1600)),
    getPhoto(meta.folderId, meta.after).then((b) => toWebJpeg(b, 1600)),
  ]);
  fs.mkdirSync(imageDir, { recursive: true });
  fs.writeFileSync(path.join(imageDir, "before.jpg"), beforeJpg);
  fs.writeFileSync(path.join(imageDir, "after.jpg"), afterJpg);
  fs.writeFileSync(postPath, matter.stringify(content, data));

  // Build before pushing: a post that breaks the site never reaches main, so
  // it can never block the deploys that come after it.
  try {
    execFileSync("npm", ["run", "build"], { stdio: "inherit" });
  } catch {
    fs.rmSync(postPath, { force: true });
    fs.rmSync(imageDir, { recursive: true, force: true });
    throw new Error("The site failed to build with this post, so it was not published");
  }

  commitAndPush(`Publish blog post: ${String(data.title)}`, [postPath, imageDir]);
  await sendText(`✅ Published — live in about 3 minutes:\n${SITE}/blog/${meta.slug}`);
  console.log(`Published ${meta.slug}`);
}

async function runSkip(jobHash: string) {
  if (!/^[0-9a-f]{16}$/.test(jobHash)) throw new Error("Invalid job reference");
  if (addSkippedJob(jobHash)) {
    commitAndPush("Content agent: skip job [skip netlify]", ["scripts/content-agent/state.json"]);
  }
}

// ------------------------------------------------------------------ entry

async function main() {
  const event = process.env.GITHUB_EVENT_NAME ?? "workflow_dispatch";
  const payload: Payload = JSON.parse(process.env.CLIENT_PAYLOAD || "{}");
  const action = event === "repository_dispatch" ? payload.action : "draft";
  console.log(`Content agent: ${action} (${event})`);

  switch (action) {
    case "publish":
      if (!payload.docFileId) throw new Error("Publish request carried no draft file");
      await runPublish(payload.docFileId);
      break;
    case "skip":
      await runSkip(payload.job ?? "");
      await sendText("⏭ Skipped — that job won't be suggested again.");
      break;
    case "next":
      await runSkip(payload.job ?? "");
      await sendText("🔄 Skipped that job — drafting from the next one…");
      await runDraft();
      break;
    case "draft":
      await runDraft();
      break;
    default:
      throw new Error(`Unknown action "${action}"`);
  }
}

main().catch(async (err: Error) => {
  console.error(err);
  // Fail loud: a missed week should look like a missed week, not silence.
  await trySendText(`⚠️ Content agent failed: ${err.message.slice(0, 400)}`, retryKeyboard);
  process.exit(1);
});
