/*
  Warnings:

  - You are about to drop the column `roomId` on the `UserModel` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserModel" DROP CONSTRAINT "UserModel_roomId_fkey";

-- AlterTable
ALTER TABLE "UserModel" DROP COLUMN "roomId";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Room";
