import { Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login/:username')
  async login(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`The user - ${username} - not found`);
    }
    // api call to validate the user
    await this.usersService.validateUserStatus(user);
    return user;
  }
}
