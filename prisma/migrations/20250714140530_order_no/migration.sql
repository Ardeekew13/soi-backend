/*
  Warnings:

  - A unique constraint covering the columns `[orderNo]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "orderNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_orderNo_key" ON "Sale"("orderNo");
