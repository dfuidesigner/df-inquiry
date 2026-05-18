-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `rewardValue` DOUBLE NULL,
    ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'NEW';

-- CreateTable
CREATE TABLE `lead_actions` (
    `id` VARCHAR(191) NOT NULL,
    `inquiryId` VARCHAR(191) NOT NULL,
    `actionType` VARCHAR(191) NOT NULL,
    `outcome` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lead_actions` ADD CONSTRAINT `lead_actions_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `Inquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
