/*
  Warnings:

  - Added the required column `jti` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "jti" TEXT NOT NULL;
