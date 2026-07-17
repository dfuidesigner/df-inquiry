-- AlterTable
ALTER TABLE `lead_actions` ADD COLUMN `adminId` VARCHAR(191) NULL,
    ADD COLUMN `metadata` JSON NULL;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_adminId_idx`(`adminId`),
    INDEX `notifications_adminId_isRead_idx`(`adminId`, `isRead`),
    INDEX `notifications_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `lead_actions_adminId_idx` ON `lead_actions`(`adminId`);

-- AddForeignKey
ALTER TABLE `lead_actions` ADD CONSTRAINT `lead_actions_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `inquiry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
