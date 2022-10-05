import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';
import { LogInWithCredentialsGuard } from './logInWithCredentials.guard';
import { User } from '../user/entities/user.entity';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<User> {
    return await this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LogInWithCredentialsGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser): Promise<User> {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser): Promise<User> {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser): Promise<void> {
    request.logOut(function (err) {
      if (err) {
        return err;
      }
    });
    request.session.cookie.maxAge = 0;
  }
}
