/*
  Warnings:

  - Added the required column `grossProfit` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "grossProfit" DOUBLE PRECISION NOT NULL;
