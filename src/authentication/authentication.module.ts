import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalSerializer } from './local.serializer';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [AuthenticationService, LocalStrategy, LocalSerializer],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, JwtModule],
})
export class AuthenticationModule {}
