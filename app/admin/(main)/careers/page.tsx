import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/admin/permissions"
import {
  CareersClient,
  type CareerSubmissionRow,
} from "./_components/careers-client"

export default async function CareersPage() {
  await requirePermission("VIEW_REPORTS")

  const submissions = await prisma.careerSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  const rows: CareerSubmissionRow[] = submissions.map((submission) => ({
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    linkedin: submission.linkedin ?? "",
    position: submission.role,
    experienceYears: submission.experienceYears ?? null,
    currentCompany: submission.currentCompany ?? "",
    location: submission.location ?? "",
    coverLetter: submission.coverLetter ?? "",
    resumeUrl: submission.resumeUrl ?? "",
    resumeFileName: submission.resumeFileName ?? "",
    status: submission.status,
    adminNote: submission.adminNote ?? "",
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  }))

  return <CareersClient submissions={rows} />
}
