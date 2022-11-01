import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Service } from '../service/entity/service.entity';
import { Speciality } from '../speciality/entity/speciality.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Service, Speciality]),
    ConfigModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
