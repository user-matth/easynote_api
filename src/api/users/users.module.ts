import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UserInterceptor } from './interceptors/user.interceptor';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: 'hard!to-guess_secret',
    }),
    PrismaModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor
    }
  ]
})
export class UsersModule {}
