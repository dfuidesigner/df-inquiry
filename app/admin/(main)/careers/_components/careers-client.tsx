"use client"

import { useState } from "react"
import { BriefcaseBusiness, FileText, UserRoundCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CareerReviewDialog } from "./career-review-dialog"
import { CareersTable } from "./careers-table"

export type CareerSubmissionRow = {
  id: string
  name: string
  email: string
  phone: string
  linkedin: string
  position: string
  experienceYears: number | null
  currentCompany: string
  location: string
  coverLetter: string
  resumeUrl: string
  resumeFileName: string
  status: string
  adminNote: string
  createdAt: string
  updatedAt: string
}

export function CareersClient({
  submissions,
}: {
  submissions: CareerSubmissionRow[]
}) {
  const [reviewingSubmission, setReviewingSubmission] =
    useState<CareerSubmissionRow | null>(null)

  const newCount = submissions.filter((item) => item.status === "NEW").length
  const shortlistedCount = submissions.filter((item) =>
    ["SHORTLISTED", "INTERVIEW", "HIRED"].includes(item.status)
  ).length

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Careers
            </h1>
            <p className="text-sm text-muted-foreground">
              Review applications, resumes, cover letters, and candidate status.
            </p>
          </div>
        </div>
        <Badge variant="outline">{submissions.length} submissions</Badge>
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Waiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
            <UserRoundCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shortlistedCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Shortlisted onward</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-8">
        <CareersTable submissions={submissions} onReview={setReviewingSubmission} />
      </div>

      <CareerReviewDialog
        submission={reviewingSubmission}
        open={!!reviewingSubmission}
        onOpenChange={(open) => !open && setReviewingSubmission(null)}
      />
    </div>
  )
}

