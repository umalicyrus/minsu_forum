/*
  Warnings:

  - Made the column `slug` on table `question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `question` MODIFY `slug` VARCHAR(191) NOT NULL;
