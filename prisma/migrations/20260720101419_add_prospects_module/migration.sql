-- AlterTable
ALTER TABLE `permissions` MODIFY `permission` ENUM('VIEW_ALL_LEADS', 'VIEW_ASSIGNED_LEADS', 'CREATE_LEAD', 'EDIT_LEAD', 'DELETE_LEAD', 'MANAGE_LEAD_CATEGORIES', 'VIEW_ACTIVITY_LOG', 'ASSIGN_LEAD', 'VIEW_PROSPECTS', 'MANAGE_PROSPECTS', 'CREATE_ADMIN', 'EDIT_ADMIN', 'DELETE_ADMIN', 'VIEW_REPORTS', 'EXPORT_LEADS') NOT NULL;

-- CreateTable
CREATE TABLE `prospect_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL DEFAULT '#64748b',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `prospect_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prospects` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `source` VARCHAR(191) NULL DEFAULT 'Import',
    `convertedLeadId` VARCHAR(191) NULL,
    `convertedAt` DATETIME(3) NULL,
    `convertedById` VARCHAR(191) NULL,
    `importedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `prospects_convertedLeadId_key`(`convertedLeadId`),
    INDEX `prospects_categoryId_idx`(`categoryId`),
    INDEX `prospects_convertedLeadId_idx`(`convertedLeadId`),
    INDEX `prospects_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `prospects` ADD CONSTRAINT `prospects_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `prospect_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospects` ADD CONSTRAINT `prospects_convertedLeadId_fkey` FOREIGN KEY (`convertedLeadId`) REFERENCES `inquiry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospects` ADD CONSTRAINT `prospects_convertedById_fkey` FOREIGN KEY (`convertedById`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prospects` ADD CONSTRAINT `prospects_importedById_fkey` FOREIGN KEY (`importedById`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
