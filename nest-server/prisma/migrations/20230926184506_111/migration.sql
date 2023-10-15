/*
  Warnings:

  - You are about to drop the column `userModelId` on the `ChatModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ChatModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatRoomId]` on the table `ChatModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatRoomId]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChatModel" DROP CONSTRAINT "ChatModel_userModelId_fkey";

-- AlterTable
ALTER TABLE "ChatModel" DROP COLUMN "userModelId",
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatModel_userId_key" ON "ChatModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatModel_chatRoomId_key" ON "ChatModel"("chatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_chatRoomId_key" ON "UserModel"("chatRoomId");

-- AddForeignKey
ALTER TABLE "ChatModel" ADD CONSTRAINT "ChatModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
