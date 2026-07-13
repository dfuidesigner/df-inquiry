-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `company` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `lead_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#2563eb',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lead_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `inquiryId` VARCHAR(191) NOT NULL,
    `requestedById` VARCHAR(191) NOT NULL,
    `assignedToId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED_LOST', 'REOPENED', 'CONVERTED', 'INVALID') NOT NULL DEFAULT 'PENDING',
    `reason` TEXT NULL,
    `resultNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `lead_verifications_inquiryId_idx`(`inquiryId`),
    INDEX `lead_verifications_assignedToId_idx`(`assignedToId`),
    INDEX `lead_verifications_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `career_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `experienceYears` DOUBLE NULL,
    `currentCompany` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `coverLetter` TEXT NULL,
    `resumeUrl` VARCHAR(191) NULL,
    `resumeFileName` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'NEW',
    `adminNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `career_submissions_status_idx`(`status`),
    INDEX `career_submissions_position_idx`(`position`),
    INDEX `career_submissions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `inquiry_categoryId_idx` ON `inquiry`(`categoryId`);

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `lead_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_verifications` ADD CONSTRAINT `lead_verifications_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_verifications` ADD CONSTRAINT `lead_verifications_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_verifications` ADD CONSTRAINT `lead_verifications_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
