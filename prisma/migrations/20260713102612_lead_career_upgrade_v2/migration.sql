/*
  Warnings:

  - You are about to drop the column `position` on the `career_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `inquiry` table. All the data in the column will be lost.
  - You are about to drop the `lead_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lead_verifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `career_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `inquiry` DROP FOREIGN KEY `inquiry_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `lead_verifications` DROP FOREIGN KEY `lead_verifications_assignedToId_fkey`;

-- DropForeignKey
ALTER TABLE `lead_verifications` DROP FOREIGN KEY `lead_verifications_inquiryId_fkey`;

-- DropForeignKey
ALTER TABLE `lead_verifications` DROP FOREIGN KEY `lead_verifications_requestedById_fkey`;

-- DropIndex
DROP INDEX `career_submissions_position_idx` ON `career_submissions`;

-- DropIndex
DROP INDEX `inquiry_categoryId_idx` ON `inquiry`;

-- AlterTable
ALTER TABLE `career_submissions` DROP COLUMN `position`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inquiry` DROP COLUMN `categoryId`;

-- DropTable
DROP TABLE `lead_categories`;

-- DropTable
DROP TABLE `lead_verifications`;

-- CreateIndex
CREATE INDEX `career_submissions_role_idx` ON `career_submissions`(`role`);
