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

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    return this.userService.createUser(
      new User({
        email,
        password,
        username,
      }),
    );
  }

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    const payload = { sub: user._id };
    const secret = this.configService.get('JWT_SECRET');

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return { accessToken, refreshToken };
  }
}
