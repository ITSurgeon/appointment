import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        SESSION_SECRET: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    CategoryModule,
    ServiceModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class AppModule {}
