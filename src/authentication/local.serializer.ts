import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(user: User, done: CallableFunction): Promise<void> {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction): Promise<void> {
    const user: User = await this.userService.getById(Number(userId));
    done(null, user);
  }
}
