-- CreateTable
CREATE TABLE `Inquiry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `message` TEXT NULL,
    `source` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NULL,
    `utm_medium` VARCHAR(191) NULL,
    `utm_campaign` VARCHAR(191) NULL,
    `utm_content` VARCHAR(191) NULL,
    `utm_term` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
