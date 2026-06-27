import { AdminRole } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@df.com"

  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  })

  if (existingAdmin) {
    console.log("✅ Super Admin already exists.")
    return
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 12)

  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: AdminRole.SUPER_ADMIN,
    },
  })

  console.log("🚀 Super Admin created successfully.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
