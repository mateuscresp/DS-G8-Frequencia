CREATE UNIQUE INDEX "calls_one_open_per_class" ON "calls" ("classId") WHERE "closedAt" IS NULL;
