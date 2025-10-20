import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesStatusMigration1734740000000 implements MigrationInterface {
  name = 'UserRolesStatusMigration1734740000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        roles TEXT NOT NULL DEFAULT '["User"]',
        status TEXT NOT NULL DEFAULT 'Enabled'
      )
    `);

    // Detect whether old columns exist (role/status as INTEGER) or new columns already exist
    const columns: Array<{ name: string }> = await queryRunner.query(`PRAGMA table_info('users')`);
    const hasOldRole = columns.some((c) => c.name === 'role');
    const hasOldStatus = columns.some((c) => c.name === 'status' && !columns.some((cc) => cc.name === 'roles'));

    if (hasOldRole) {
      // Copy from old schema (role TEXT, status INTEGER)
      await queryRunner.query(`
        INSERT INTO users_new (id, username, roles, status)
        SELECT 
          id,
          username,
          CASE 
            WHEN role = 'Admin' THEN '["Admin"]'
            WHEN role = 'Editor' THEN '["Editor"]'
            ELSE '["User"]'
          END AS roles,
          CASE 
            WHEN status = 1 THEN 'Enabled'
            ELSE 'Disabled'
          END AS status
        FROM users
      `);
    } else {
      // Copy from new schema shape if it already exists (roles TEXT, status TEXT)
      // Use COALESCE to ensure defaults if any row has nulls
      const hasRoles = columns.some((c) => c.name === 'roles');
      const hasStatusText = columns.some((c) => c.name === 'status');
      if (hasRoles && hasStatusText) {
        await queryRunner.query(`
          INSERT INTO users_new (id, username, roles, status)
          SELECT 
            id,
            username,
            COALESCE(roles, '["User"]') AS roles,
            COALESCE(status, 'Enabled') AS status
          FROM users
        `);
      } else {
        // If users table is empty or in unexpected state, just proceed without data copy
      }
    }

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users_old (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'User',
        status INTEGER NOT NULL DEFAULT 1
      )
    `);

    await queryRunner.query(`
      INSERT INTO users_old (id, username, role, status)
      SELECT 
        id,
        username,
        CASE 
          WHEN roles LIKE '%Admin%' THEN 'Admin'
          WHEN roles LIKE '%Editor%' THEN 'Editor'
          ELSE 'User'
        END AS role,
        CASE 
          WHEN status = 'Enabled' THEN 1
          ELSE 0
        END AS status
      FROM users
    `);

    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`ALTER TABLE users_old RENAME TO users`);
  }
}