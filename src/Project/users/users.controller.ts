import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppGuard } from '../auth/guards/authguard.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AppGuard)
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('profile')
  @UseGuards(AppGuard)
  getProfile(@CurrentUser() user: any) {
    try {
      this.logger.log(`Getting profile for user: ${user._id}`);

      return {
        message: 'This is a protected route',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting profile: ${error.message}`, error.stack);
      throw error;
    }
  }
}
