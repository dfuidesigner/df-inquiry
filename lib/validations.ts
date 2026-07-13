import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  // phone: z
  //   .string()
  //   .regex(
  //     /^(?:\+91|91)?[6-9]\d{9}$/,
  //     "Please enter a valid Indian mobile number"
  //   ),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number without +91"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),

  website: z.string().max(0, { message: "Bot detected" }).optional(),
  formStart: z.string().optional(),
company: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
  