-- CreateTable
CREATE TABLE `lead_reassignments` (
    `id` VARCHAR(191) NOT NULL,
    `inquiryId` VARCHAR(191) NOT NULL,
    `fromAdminId` VARCHAR(191) NULL,
    `toAdminId` VARCHAR(191) NOT NULL,
    `reassignedById` VARCHAR(191) NOT NULL,
    `previousStatus` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lead_reassignments_inquiryId_idx`(`inquiryId`),
    INDEX `lead_reassignments_fromAdminId_idx`(`fromAdminId`),
    INDEX `lead_reassignments_toAdminId_idx`(`toAdminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lead_reassignments` ADD CONSTRAINT `lead_reassignments_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_reassignments` ADD CONSTRAINT `lead_reassignments_fromAdminId_fkey` FOREIGN KEY (`fromAdminId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_reassignments` ADD CONSTRAINT `lead_reassignments_toAdminId_fkey` FOREIGN KEY (`toAdminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_reassignments` ADD CONSTRAINT `lead_reassignments_reassignedById_fkey` FOREIGN KEY (`reassignedById`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
