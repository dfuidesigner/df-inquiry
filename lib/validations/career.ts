import { z } from "zod"

export const CareerSubmissionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  role: z.string().min(2, "Position is required"),
  experienceYears: z.coerce.number().min(0).optional(),
  currentCompany: z.string().optional(),
  location: z.string().optional(),
  coverLetter: z.string().optional(),
})

export const UpdateCareerSubmissionSchema = z.object({
  status: z.enum([
    "NEW",
    "REVIEWING",
    "SHORTLISTED",
    "INTERVIEW",
    "REJECTED",
    "HIRED",
  ]),
  adminNote: z.string().optional(),
})

export type CareerSubmissionInput = z.input<typeof CareerSubmissionSchema>
export type UpdateCareerSubmissionInput = z.input<
  typeof UpdateCareerSubmissionSchema
>
