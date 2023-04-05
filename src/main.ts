import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require("dotenv").config();
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(multer().any());
  await app.listen(3000);
}
bootstrap();
