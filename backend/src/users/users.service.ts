import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  /**
   * Find user by username.
   * @param username - unique username
   * @returns user or null if not found
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }
  /**
   * Ensure user is not Deleted; throws 401 otherwise.
   * @param user - resolved user entity
   */
  async validateUserStatus(user: User): Promise<void> {
    if (user.status === UserStatus.DELETED) {
      throw new UnauthorizedException('User account has been deleted');
    }
  }
}
