-- Singleton settings: add stable unique key so upserts do not depend on primary key id.
-- Fails if more than one row exists; consolidate manually if needed.

DO $$
BEGIN
  IF (SELECT COUNT(*)::int FROM "Settings") > 1 THEN
    RAISE EXCEPTION 'Settings table has multiple rows; keep one row before running this migration';
  END IF;
END $$;

ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "settingsKey" TEXT;

UPDATE "Settings" SET "settingsKey" = 'singleton' WHERE "settingsKey" IS NULL;

CREATE UNIQUE INDEX "Settings_settingsKey_key" ON "Settings"("settingsKey");

ALTER TABLE "Settings" ALTER COLUMN "settingsKey" SET NOT NULL;

ALTER TABLE "Settings" ALTER COLUMN "id" DROP DEFAULT;
