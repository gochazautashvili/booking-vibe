/*
  Warnings:

  - You are about to drop the column `swimmingpool` on the `Hotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "swimmingpool",
ADD COLUMN     "bikeRental" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freeParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restaurant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "swimmingPool" BOOLEAN NOT NULL DEFAULT false;
