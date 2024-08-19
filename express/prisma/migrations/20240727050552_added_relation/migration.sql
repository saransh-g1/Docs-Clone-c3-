/*
  Warnings:

  - Added the required column `userId` to the `UserConnectedToDocs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserConnectedToDocs" ADD COLUMN     "userId" INTEGER NOT NULL;
