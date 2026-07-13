import { NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { CareerSubmissionSchema } from "@/lib/validations/career"

export const runtime = "nodejs"

const MAX_RESUME_SIZE = 5 * 1024 * 1024
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

function safeFileName(fileName: string) {
  const extension = path.extname(fileName).toLowerCase()
  const baseName = path
    .basename(fileName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)

  return `${baseName || "resume"}-${Date.now()}${extension}`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const resume = formData.get("resume")

    const validated = CareerSubmissionSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      linkedin: formData.get("linkedin") || "",
      role: formData.get("role"),
      experienceYears: formData.get("experienceYears") || undefined,
      currentCompany: formData.get("currentCompany") || "",
      location: formData.get("location") || "",
      coverLetter: formData.get("coverLetter") || "",
    })

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid career submission.",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    if (!(resume instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume file is required.",
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_RESUME_TYPES.has(resume.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume must be a PDF, DOC, or DOCX file.",
        },
        { status: 400 }
      )
    }

    if (resume.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume must be 5MB or smaller.",
        },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "careers")
    await mkdir(uploadDir, { recursive: true })

    const storedFileName = safeFileName(resume.name)
    const filePath = path.join(uploadDir, storedFileName)
    const bytes = Buffer.from(await resume.arrayBuffer())
    await writeFile(filePath, bytes)

    const resumeUrl = `/uploads/careers/${storedFileName}`

    const submission = await prisma.careerSubmission.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        linkedin: validated.data.linkedin || null,
        role: validated.data.role,
        experienceYears: validated.data.experienceYears ?? null,
        currentCompany: validated.data.currentCompany || null,
        location: validated.data.location || null,
        coverLetter: validated.data.coverLetter || null,
        resumeUrl,
        resumeFileName: resume.name,
      },
      select: { id: true },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Career submission received.",
        id: submission.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Failed to submit career application." },
      { status: 500 }
    )
  }
}
