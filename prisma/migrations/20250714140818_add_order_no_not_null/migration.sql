/*
  Warnings:

  - Made the column `orderNo` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "orderNo" SET NOT NULL;
