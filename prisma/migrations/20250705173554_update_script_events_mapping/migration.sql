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
