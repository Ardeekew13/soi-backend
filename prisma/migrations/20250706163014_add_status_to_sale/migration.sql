/*
  Warnings:

  - Added the required column `status` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voidReason` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "voidReason" TEXT NOT NULL;
