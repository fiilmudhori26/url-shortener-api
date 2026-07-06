-- CreateTable
CREATE TABLE `urls` (
    `id` VARCHAR(191) NOT NULL,
    `originalUrl` TEXT NOT NULL,
    `shortCode` VARCHAR(10) NOT NULL,
    `clickCount` INTEGER NOT NULL DEFAULT 0,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `urls_shortCode_key`(`shortCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
