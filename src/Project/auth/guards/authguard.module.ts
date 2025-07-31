import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard, AppGuard } from './authguard.service';
import { UsersModule } from 'src/Project/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [JwtAuthGuard, AppGuard],
  exports: [JwtAuthGuard, AppGuard, JwtModule],
})
export class AuthguardModule {}
