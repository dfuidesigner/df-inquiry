-- CreateTable
CREATE TABLE `admin_tasks` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `taskType` ENUM('CALL', 'CLIENT_MEETING', 'FOLLOW_UP', 'DEMO', 'PROPOSAL', 'DOCUMENTATION', 'INTERNAL_WORK', 'OTHER') NOT NULL,
    `status` ENUM('DONE', 'IN_PROGRESS', 'BLOCKED') NOT NULL DEFAULT 'DONE',
    `title` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NULL,
    `clientPhone` VARCHAR(191) NULL,
    `clientEmail` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `outcome` TEXT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `taskDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `admin_tasks_adminId_idx`(`adminId`),
    INDEX `admin_tasks_leadId_idx`(`leadId`),
    INDEX `admin_tasks_taskDate_idx`(`taskDate`),
    INDEX `admin_tasks_taskType_idx`(`taskType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_tasks` ADD CONSTRAINT `admin_tasks_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_tasks` ADD CONSTRAINT `admin_tasks_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `inquiry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
