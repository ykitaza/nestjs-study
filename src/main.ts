import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// dto クラスバリデーションに使用
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
// クッキーの処理に使用
import * as cookieParser from 'cookie-parser';
// csrf対策
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validationを有効化するための設定。 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    // JWTをcookieベースでやり取りするための設定
    credentials: true,
    // CORSを許可するorigin(スキーマ、ドメイン、ポート)を指定
    origin: ['http://localhost:3000'],
  })
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(3005);
}
bootstrap();
