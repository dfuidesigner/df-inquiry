/*
  Warnings:

  - You are about to drop the `prospect_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `prospects` DROP FOREIGN KEY `prospects_categoryId_fkey`;

-- DropTable
DROP TABLE `prospect_categories`;

-- AddForeignKey
ALTER TABLE `prospects` ADD CONSTRAINT `prospects_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `lead_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
