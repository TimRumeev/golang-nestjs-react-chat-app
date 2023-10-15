-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "chatRoomId" INTEGER;

-- CreateTable
CREATE TABLE "ChatModel" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "userModelId" INTEGER NOT NULL,
    "chatRoomId" INTEGER,

    CONSTRAINT "ChatModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoomModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChatRoomModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserModel" ADD CONSTRAINT "UserModel_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoomModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModel" ADD CONSTRAINT "ChatModel_userModelId_fkey" FOREIGN KEY ("userModelId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModel" ADD CONSTRAINT "ChatModel_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoomModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
