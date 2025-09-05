/*
  Warnings:

  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropIndex
DROP INDEX `Product_categoryId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `categoryId`,
    DROP COLUMN `isFeatured`,
    DROP COLUMN `status`,
    DROP COLUMN `stock`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `condition` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `category`;
