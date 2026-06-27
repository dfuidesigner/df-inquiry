/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `admins` table. All the data in the column will be lost.
  - Added the required column `password` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admins` DROP COLUMN `passwordHash`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;
