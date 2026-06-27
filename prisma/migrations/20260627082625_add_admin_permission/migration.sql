-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `assignedToId` VARCHAR(191) NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'MANAGER', 'SALES') NOT NULL DEFAULT 'SALES',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `permission` ENUM('VIEW_ALL_LEADS', 'VIEW_ASSIGNED_LEADS', 'CREATE_LEAD', 'EDIT_LEAD', 'DELETE_LEAD', 'ASSIGN_LEAD', 'CREATE_ADMIN', 'EDIT_ADMIN', 'DELETE_ADMIN', 'VIEW_REPORTS', 'EXPORT_LEADS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `permissions_adminId_permission_key`(`adminId`, `permission`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `inquiry_assignedToId_idx` ON `inquiry`(`assignedToId`);

-- CreateIndex
CREATE INDEX `inquiry_status_idx` ON `inquiry`(`status`);

-- CreateIndex
CREATE INDEX `inquiry_createdAt_idx` ON `inquiry`(`createdAt`);

-- CreateIndex
CREATE INDEX `lead_actions_createdAt_idx` ON `lead_actions`(`createdAt`);

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `lead_actions` RENAME INDEX `lead_actions_inquiryId_fkey` TO `lead_actions_inquiryId_idx`;
