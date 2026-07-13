import path from "path"
import { mkdirSync } from "fs"

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads")

export function getUploadDir() {
  mkdirSync(UPLOAD_DIR, { recursive: true })
  return UPLOAD_DIR
}
