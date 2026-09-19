import Anthropic from "@anthropic-ai/sdk";
import { serviceSlugs, servicesData } from "@/lib/services";
import { cities } from "@/lib/cities";
import { pricingPlans } from "@/lib/plans";
import type { Job, JobPhoto } from "./lib";

export type Draft = {
  usable: boolean;
  unusableReason: string;
  beforePhoto: number;
  afterPhoto: number;
  privacyFlags: string[];
  title: string;
  slug: string;
  excerpt: string;
  keywords: string[];
  relatedServices: string[];
  relatedCities: string[];
  faqs: { q: string; a: string }[];
  beforeAlt: string;
  afterAlt: string;
  body: string;
};

const citySlugs = cities.map((c) => c.slug);

// The steps a package actually includes, straight from the pricing the site
// publishes. This is what lets the post say "the crew did X" truthfully - the
// job record only names the package, not what was done.
function packageSteps(packageName: string): string[] | null {
  const plan = pricingPlans.find((p) => p.name.toLowerCase() === packageName.trim().toLowerCase());
  if (!plan) return null;
  const steps = plan.features ?? plan.featureSections?.flatMap((section) => section.items) ?? [];
  // Asterisked steps (e.g. "Pet Hair Removal*") only happen when the car
  // needs them, so they can't be claimed as done without the notes saying so.
  return steps.filter((step) => !step.endsWith("*"));
}

const stringArray = { type: "array", items: { type: "string" } };

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "usable", "unusableReason", "beforePhoto", "afterPhoto", "privacyFlags", "title", "slug",
    "excerpt", "keywords", "relatedServices", "relatedCities", "faqs", "beforeAlt", "afterAlt", "body",
  ],
  properties: {
    usable: { type: "boolean" },
    unusableReason: { type: "string" },
    beforePhoto: { type: "integer" },
    afterPhoto: { type: "integer" },
    privacyFlags: stringArray,
    title: { type: "string" },
    slug: { type: "string" },
    excerpt: { type: "string" },
    keywords: stringArray,
    relatedServices: { type: "array", items: { type: "string", enum: serviceSlugs } },
    relatedCities: { type: "array", items: { type: "string", enum: citySlugs } },
    faqs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["q", "a"],
        properties: { q: { type: "string" }, a: { type: "string" } },
      },
    },
    beforeAlt: { type: "string" },
    afterAlt: { type: "string" },
    body: { type: "string" },
  },
};

const SYSTEM_PROMPT = `You write case-study blog posts for Teal Detailing, a mobile car detailing company serving Miami-Dade, Broward, and Palm Beach counties in South Florida. Each post is built from one real completed job - the job record and the photos the crew took - and you also choose which two photos illustrate it.

These posts are worth publishing only because they describe something that really happened, so accuracy comes first:
- State as fact only what the job record says or what is clearly visible in the photos. General detailing knowledge - why a technique works, how South Florida's sun, salt air, rain, sand, and humidity affect cars - is welcome as context, framed as general knowledge rather than a claim about this job.
- When describing what the crew did, use only the package steps and add-ons listed in the job record, and mention only the steps that matter to this car's story rather than walking through the whole list. A step that isn't listed can appear only as general advice ("a chemical decon pass is often the next step"), never as something done to this car - the owner may read the post about their own vehicle.
- Don't invent specifics: no customer quotes, no durations or timelines ("a few hours later", "in one afternoon"), no product brand names, no prices. Name the make and model only if the record states it or it is unmistakable in the photos; otherwise use the vehicle type ("the SUV").
- The customer is anonymous. Never include names, phone numbers, street names, or house numbers. Refer to location at city or neighborhood level only.

Photos:
- Pick one BEFORE and one AFTER photo, ideally the same area from a similar angle so the difference is obvious. File and subfolder names are hints ("before", "after", "IMG_1234"); trust what you see over the names.
- In privacyFlags, list anything in the two chosen photos that deserves a second look before publishing: a readable license plate, a person's face, a house number or identifiable home exterior, documents or personal items showing names. Use an empty list if there is nothing.
- If the photos can't support an honest before/after post - no clear before and after, too blurry, mostly people - set usable to false, explain why in unusableReason, and leave the other fields empty (0 for the photo numbers).

The post:
- 650-1,000 words of MDX body. No frontmatter and no H1 - the title is rendered separately. Use ## and ### headings.
- Put the markers {{BEFORE_IMAGE}} and {{AFTER_IMAGE}} on their own lines where the photos belong, each exactly once.
- Tell it as something a car owner can use: what the car came in with, why that problem happens (South Florida conditions especially), what the crew did and why, the result, and how an owner can keep it that way.
- Link 1-3 relevant service pages as /services/<slug>, and the city page as /<city-slug>/mobile-car-detailing when the job's city has one, using markdown links with natural anchor text. Use only slugs from the lists provided; relatedServices and relatedCities come from the same lists.
- Match the voice of the example post: direct, specific, plain-spoken, no hype, no exclamation marks, no filler openings.
- title: specific and searchable, under 70 characters - what was fixed, the vehicle type, and the city usually make a good title. slug: lowercase words joined by hyphens, under 60 characters. excerpt: one or two sentences, under 200 characters. keywords: 3-6 phrases a car owner would search. faqs: 2-3 questions an owner would actually search, each answered in 1-3 sentences of general guidance consistent with the post. beforeAlt / afterAlt: a literal description of each chosen photo; they become the image alt text and captions.`;

export async function writeDraft(input: {
  job: Job;
  photos: JobPhoto[];
  existingTitles: string[];
  examplePost: string;
}): Promise<Draft> {
  const { job, photos } = input;

  const steps = packageSteps(job.packageName);
  const facts = [
    `Completed: ${job.date || "unknown"}`,
    `Vehicle type: ${job.vehicleType || "not recorded"}`,
    `Package: ${job.packageName || "not recorded"}`,
    steps
      ? `Steps included in that package (the work performed):\n${steps.map((s) => `  - ${s}`).join("\n")}`
      : `Steps included in that package: unknown - describe the work only in general terms`,
    `Add-ons: ${job.addOns || "none"}`,
    `Crew notes: ${job.notes || "none"}`,
    `Area: ${job.area || "not recorded"} (mention only the city or neighborhood)`,
  ].join("\n");

  const content: Anthropic.Beta.BetaContentBlockParam[] = [
    {
      type: "text",
      text: [
        `Job record:\n${facts}`,
        `Allowed service slugs:\n${serviceSlugs.map((s) => `${s} (${servicesData[s].name})`).join("\n")}`,
        `Allowed city slugs:\n${cities.map((c) => `${c.slug} (${c.name})`).join("\n")}`,
        `Existing post titles - take a different angle from these:\n${input.existingTitles.join("\n") || "(none yet)"}`,
        `Example post, for voice only:\n<example>\n${input.examplePost}\n</example>`,
        `The job's photos follow, numbered from 1.`,
      ].join("\n\n"),
    },
  ];

  photos.forEach((photo, i) => {
    content.push({
      type: "text",
      text: `Photo ${i + 1} - file: ${photo.name}${photo.folder ? `, subfolder: ${photo.folder}` : ""}`,
    });
    content.push({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: photo.thumb ?? "" },
    });
  });
  content.push({ type: "text", text: "Pick the two photos and write the post." });

  const client = new Anthropic();
  const message = await client.beta.messages
    .stream({
      model: "claude-opus-5",
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: "high", format: { type: "json_schema", schema: DRAFT_SCHEMA } },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    })
    .finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error("The model declined to write this post");
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error("The draft was cut off before it finished");
  }

  const text = message.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  try {
    return JSON.parse(text) as Draft;
  } catch {
    throw new Error("The model's response wasn't valid JSON");
  }
}
