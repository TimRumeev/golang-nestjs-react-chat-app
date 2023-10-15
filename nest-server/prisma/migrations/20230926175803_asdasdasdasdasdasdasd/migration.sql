-- DropForeignKey
ALTER TABLE "ChatModel" DROP CONSTRAINT "ChatModel_userModelId_fkey";

-- AlterTable
ALTER TABLE "ChatModel" ALTER COLUMN "userModelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatModel" ADD CONSTRAINT "ChatModel_userModelId_fkey" FOREIGN KEY ("userModelId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
