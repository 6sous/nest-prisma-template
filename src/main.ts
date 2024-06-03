import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser()); // Cut this line if you don't need cookies
  await app.listen(process.env.APP_PORT || 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
