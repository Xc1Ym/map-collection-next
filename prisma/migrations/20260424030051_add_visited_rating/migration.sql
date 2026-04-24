-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "rating" DECIMAL(2,1),
ADD COLUMN     "visited" BOOLEAN NOT NULL DEFAULT false;
