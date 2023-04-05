import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: 'hard!to-guess_secret',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService]
})
export class UsersModule {}
