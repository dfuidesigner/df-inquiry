import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"
import { getUploadDir } from "@/lib/local-storage"

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  if (
    !filename ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..")
  ) {
    return new NextResponse("Not found", { status: 404 })
  }

  const filePath = path.join(getUploadDir(), "careers", filename)

  try {
    const info = await stat(filePath)

    if (!info.isFile()) {
      return new NextResponse("Not found", { status: 404 })
    }

    const buffer = await readFile(filePath)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          MIME_BY_EXT[path.extname(filename).toLowerCase()] ??
          "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
