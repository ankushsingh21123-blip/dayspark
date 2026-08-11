SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='proof_photos' AND COLUMN_NAME='caption'),
  'SELECT 1',
  "ALTER TABLE proof_photos ADD COLUMN caption VARCHAR(240) NOT NULL DEFAULT '' AFTER daily_moment_id"
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;

UPDATE proof_photos p JOIN daily_moment_days d ON d.id=p.daily_moment_id SET p.caption=d.caption WHERE p.caption='' AND d.caption<>'';

SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='proof_photos' AND INDEX_NAME='proof_daily_moment'),
  'SELECT 1',
  'ALTER TABLE proof_photos ADD INDEX proof_daily_moment (daily_moment_id)'
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;

SET @dayspark_sql = IF(
  EXISTS(SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='proof_photos' AND INDEX_NAME='uq_proof_daily_moment'),
  'ALTER TABLE proof_photos DROP INDEX uq_proof_daily_moment',
  'SELECT 1'
);
PREPARE dayspark_statement FROM @dayspark_sql;
EXECUTE dayspark_statement;
DEALLOCATE PREPARE dayspark_statement;

UPDATE daily_moment_days SET status='scheduled',captured_at=NULL,caption='' WHERE status='captured';
