/*
  Warnings:

  - Added the required column `costOfGoods` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "costOfGoods" DOUBLE PRECISION NOT NULL;
