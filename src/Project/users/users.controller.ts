import { Body, Post,Get, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/Schema/users.Schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }
  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
}
