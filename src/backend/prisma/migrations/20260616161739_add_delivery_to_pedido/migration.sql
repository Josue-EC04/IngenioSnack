-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "delivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "direccion" TEXT;
