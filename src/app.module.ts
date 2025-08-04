import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './Project/users/users.module';
import { AuthModule } from './Project/auth/auth.module';
import { AuthguardModule } from './Project/auth/guards/authguard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get('MONGODB_URI') ||
          'mongodb://ec2-13-49-238-61.eu-north-1.compute.amazonaws.com:27017/event_Back',
      }),
    }),
    UsersModule,
    AuthModule,
    AuthguardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
