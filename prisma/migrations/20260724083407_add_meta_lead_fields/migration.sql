/*
  Warnings:

  - A unique constraint covering the columns `[metaLeadgenId]` on the table `inquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `metaAdId` VARCHAR(191) NULL,
    ADD COLUMN `metaCampaignId` VARCHAR(191) NULL,
    ADD COLUMN `metaFormId` VARCHAR(191) NULL,
    ADD COLUMN `metaLeadgenId` VARCHAR(191) NULL,
    ADD COLUMN `metaPageId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `inquiry_metaLeadgenId_key` ON `inquiry`(`metaLeadgenId`);
