SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='daily_checkins' AND COLUMN_NAME='intention'),
  'SELECT 1',
  'ALTER TABLE daily_checkins ADD COLUMN intention VARCHAR(280) NULL AFTER note'
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;

SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='daily_checkins' AND COLUMN_NAME='win'),
  'SELECT 1',
  'ALTER TABLE daily_checkins ADD COLUMN win VARCHAR(280) NULL AFTER intention'
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;

SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='daily_checkins' AND COLUMN_NAME='gratitude'),
  'SELECT 1',
  'ALTER TABLE daily_checkins ADD COLUMN gratitude VARCHAR(280) NULL AFTER win'
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;
