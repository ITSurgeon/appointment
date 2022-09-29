import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { createClient } from 'redis';

const RedisStore = require('connect-redis')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const redisHost = configService.get('REDIS_HOST');
  const redisPort = configService.get('REDIS_PORT');
  const sessionSecret = configService.get('SESSION_SECRET');

  const redisClient = createClient({
    legacyMode: true,
    url: `redis://${redisHost}:${redisPort}`,
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect().catch(console.error);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        saveUninitialized: false,
        secret: configService.get('REDIS_HOST'),
        resave: false,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
