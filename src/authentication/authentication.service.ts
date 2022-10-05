import { UserService } from '../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      registrationData.password,
      10,
    );
    return await this.userService.create({
      ...registrationData,
      password: hashedPassword,
    });
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user: User = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (isPasswordMatching) {
      return isPasswordMatching;
    }
    throw new HttpException(
      'Wrong credentials provided',
      HttpStatus.BAD_REQUEST,
    );
  }
}
