import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/Schema/users.Schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, username: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.userService.createUser(email, password, username);
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { sub: user._id };
      const secret = this.configService.get('JWT_SECRET');

      const accessToken = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '15m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '7d',
      });
      return { accessToken, refreshToken };
    } catch (error) {
    
      throw error;
    }
  }
}
