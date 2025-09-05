-- CreateTable
CREATE TABLE `announcement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Cart_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `CartItem_cartId_fkey`(`cartId`),
    INDEX `CartItem_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `filters` LONGTEXT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buyerId` INTEGER NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Chat_buyerId_fkey`(`buyerId`),
    INDEX `Chat_productId_fkey`(`productId`),
    INDEX `Chat_sellerId_fkey`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `targetId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Log_adminId_fkey`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Message_chatId_fkey`(`chatId`),
    INDEX `Message_senderId_fkey`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buyerId` INTEGER NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `totalAmount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Order_buyerId_fkey`(`buyerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    INDEX `OrderItem_orderId_fkey`(`orderId`),
    INDEX `OrderItem_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED') NOT NULL DEFAULT 'PENDING',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sellerId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Product_categoryId_fkey`(`categoryId`),
    INDEX `Product_sellerId_fkey`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterId` INTEGER NOT NULL,
    `reportedUserId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Report_productId_fkey`(`productId`),
    INDEX `Report_reportedUserId_fkey`(`reportedUserId`),
    INDEX `Report_reporterId_fkey`(`reporterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sellerverification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `documents` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SellerVerification_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `paymentStatus` ENUM('SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'SUCCESS',
    `paymentMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Transaction_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `Wishlist_productId_fkey`(`productId`),
    INDEX `Wishlist_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `Chat_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `Chat_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `Chat_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `Log_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `Message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `Report_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `Report_reportedUserId_fkey` FOREIGN KEY (`reportedUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sellerverification` ADD CONSTRAINT `SellerVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `Transaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
