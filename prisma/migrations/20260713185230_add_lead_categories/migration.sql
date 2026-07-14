-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `permissions` MODIFY `permission` ENUM('VIEW_ALL_LEADS', 'VIEW_ASSIGNED_LEADS', 'CREATE_LEAD', 'EDIT_LEAD', 'DELETE_LEAD', 'MANAGE_LEAD_CATEGORIES', 'ASSIGN_LEAD', 'CREATE_ADMIN', 'EDIT_ADMIN', 'DELETE_ADMIN', 'VIEW_REPORTS', 'EXPORT_LEADS') NOT NULL;

-- CreateTable
CREATE TABLE `lead_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL DEFAULT '#64748b',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lead_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `inquiry_categoryId_idx` ON `inquiry`(`categoryId`);

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `lead_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
