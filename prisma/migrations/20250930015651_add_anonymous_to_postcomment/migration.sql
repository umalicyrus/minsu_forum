-- AlterTable
ALTER TABLE `answer` ADD COLUMN `anonymous` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `post` MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `postcomment` ADD COLUMN `anonymous` BOOLEAN NOT NULL DEFAULT false;
