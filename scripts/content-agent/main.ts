import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { getAllPosts, getPostBySlug, validateFrontmatter, BLOG_DIR } from "@/lib/blog";
import { getCityBySlug } from "@/lib/cities";
import {
  SITE, addSkippedJob, approvalKeyboard, commitAndPush, downloadTelegramFile, getPhoto, hashJobId,
  listJobs, listPhotos, placeImages, readState, retryKeyboard, sendDocument, sendPhotos, sendText, toWebJpeg,
  todayEastern, trySendText, type Job, type JobPhoto,
} from "./lib";
import { writeDraft, type Draft } from "./writer";

// Checking a folder for a named before/after pair costs nothing but an Apps
// Script call, so a run can look through many jobs; model calls are the
// part that costs money, and those are capped separately.
const MAX_JOBS_CHECKED = 15;
const MAX_DRAFTS_PER_RUN = 3;
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
function checkDraft(draft: Draft) {
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

async function draftFromJob(job: Job, before: JobPhoto, after: JobPhoto): Promise<"sent" | "unusable"> {
  const jobHash = hashJobId(job.jobId);
  const posts = getAllPosts();
  const example = posts.find((p) => p.category === "case-study") ?? posts[0];
  const examplePost = example ? getPostBySlug(example.slug)?.content ?? "" : "";

  console.log(`Drafting from job ${jobHash}`);
  const draft = await writeDraft({ job, before, after, existingTitles: posts.map((p) => p.title), examplePost });

  if (!draft.usable) {
    console.log(`Job ${jobHash} judged unusable`);
    await sendText(`ℹ️ Passed over ${job.jobId}: ${draft.unusableReason}

If the wrong photos are named, rename them and tap Try again.`);
    return "unusable";
  }
  const placed = placeImages(draft.body);
  // Counts only - never the text itself, since these logs are public.
  console.log(`Photo markers written by the model: before=${placed.found.BEFORE} after=${placed.found.AFTER}`);
  draft.body = placed.body;
  checkDraft(draft);

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

  await sendText(`📝 This week's draft — ${[job.jobId, job.vehicleType, job.packageName, city].filter(Boolean).join(" · ")}`);
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

  // Jobs are used only once the owner has named a before and an after photo
  // in the folder. Nothing is recorded for jobs passed over here - naming the
  // photos later makes them eligible again.
  const notReady: string[] = [];
  let drafts = 0;
  let sent = false;
  for (const job of candidates.slice(0, MAX_JOBS_CHECKED)) {
    if (drafts >= MAX_DRAFTS_PER_RUN) break;
    const { photos } = await listPhotos(job.folderId);
    const before = photos.find((p) => p.role === "before");
    const after = photos.find((p) => p.role === "after");
    if (!before || !after) {
      notReady.push(`${job.jobId}: no photo named ${!before && !after ? '"before" or "after"' : !before ? '"before"' : '"after"'}`);
      continue;
    }
    if (!before.thumb || !after.thumb) {
      notReady.push(`${job.jobId}: Drive hasn't made previews of the named photos yet`);
      continue;
    }

    // Thumbnails come from Drive in whatever format it rendered; normalise so
    // the model always gets small JPEGs.
    const small = async (p: JobPhoto) => ({
      ...p,
      thumb: (await toWebJpeg(Buffer.from(p.thumb!, "base64"), 800)).toString("base64"),
    });

    drafts++;
    if ((await draftFromJob(job, await small(before), await small(after))) === "sent") {
      sent = true;
      break;
    }
  }

  if (!sent) {
    const checked = notReady.length
      ? `\n\nJobs checked:\n${notReady.slice(0, 8).map((line) => `• ${line}`).join("\n")}`
      : "";
    await sendText(
      `📭 No post this week — no recent job has a photo named "before" and one named "after" in its folder.${checked}\n\nRename the best two photos in a job's folder, then tap below.`,
      retryKeyboard
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
