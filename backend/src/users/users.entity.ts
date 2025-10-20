import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// User status values
export enum UserStatus {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
  DELETED = 'Deleted'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;
// Roles stored as JSON string (SQLite-friendly)
  @Column('simple-json', { default: '["User"]' })
  roles: string[];
// Status as text; default Enabled
  @Column({ type: 'varchar', default: UserStatus.ENABLED })
  status: UserStatus;
// Has a specific role
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
// Has any role from list
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.roles.includes(role));
  }
// Is user enabled?
  isActive(): boolean {
    return this.status === UserStatus.ENABLED;
  }
}
