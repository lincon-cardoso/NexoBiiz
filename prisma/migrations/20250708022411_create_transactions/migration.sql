/*
  Warnings:

  - You are about to drop the column `event_type` on the `scriptevents` table. All the data in the column will be lost.
  - You are about to drop the column `script_name` on the `scriptevents` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `scriptevents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scriptName` to the `scriptevents` table without a default value. This is not possible if the table is not empty.
  - Made the column `timestamp` on table `scriptevents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "scriptevents" DROP COLUMN "event_type",
DROP COLUMN "script_name",
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "scriptName" TEXT NOT NULL,
ALTER COLUMN "timestamp" SET NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
