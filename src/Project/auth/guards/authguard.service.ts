import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { User } from 'src/Schema/users.Schema';
import { UsersService } from 'src/Project/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        iat: number;
      }>(token, { secret: process.env.JWT_SECRET });

      const user = await this.usersService.findUserById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid or missing token');
      }
      (request as any).user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or missing token');
    }
  }
}

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        iat: number;
      }>(token, { secret: process.env.JWT_SECRET });

      const user = await this.usersService.findUserById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid or missing token');
      }
      (request as any).user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or missing token');
    }
  }
}
