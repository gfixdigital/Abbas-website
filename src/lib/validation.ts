import { z } from "zod";

/** Shared between the client form and the server action, so they cannot drift. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  company: z.string().trim().max(160, "That is too long.").optional().or(z.literal("")),
  topic: z.enum([
    "project",
    "training",
    "speaking",
    "partnership",
    "other",
  ]),
  budget: z
    .enum(["undecided", "under-100k", "100k-500k", "500k-plus"])
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, "Please give me a bit more detail, at least 20 characters.")
    .max(4000, "Please keep this under 4000 characters."),
  /** Honeypot. Real users never see it, so a filled value means a bot. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const TOPIC_LABELS: Record<ContactInput["topic"], string> = {
  project: "A client project",
  training: "Training or a cohort",
  speaking: "Speaking or a session",
  partnership: "Partnership or media",
  other: "Something else",
};

export const BUDGET_LABELS: Record<
  NonNullable<ContactInput["budget"]>,
  string
> = {
  undecided: "Not decided yet",
  "under-100k": "Under PKR 100,000",
  "100k-500k": "PKR 100,000 to 500,000",
  "500k-plus": "PKR 500,000 and above",
};
