import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppGuard } from '../auth/guards/authguard.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AppGuard)
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('profile')
  @UseGuards(AppGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'This is a protected route',
      user: {
        id: user.userId,
        email: user.email,
        username: user.user.username,
      },
    };
  }
}
