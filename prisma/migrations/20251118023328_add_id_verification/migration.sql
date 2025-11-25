-- AlterTable
ALTER TABLE `user` ADD COLUMN `idBack` VARCHAR(191) NULL,
    ADD COLUMN `idFront` VARCHAR(191) NULL,
    ADD COLUMN `selfieUrl` VARCHAR(191) NULL,
    ADD COLUMN `verificationStatus` VARCHAR(191) NOT NULL DEFAULT 'unverified';
