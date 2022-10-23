import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findMany(@Query() query: FindManyUsersDto): Promise<{
    data: { totalCount: number; currentPage: number; users: User[] };
  }> {
    const { totalCount, entities } = await this.userService.findManyUsers(
      query,
    );

    return {
      data: {
        totalCount,
        currentPage: query.page || 1,
        users: entities,
      },
    };
  }

  @Get(':id')
  getOneByID(@Param('id') id: string) {
    return this.userService.getById(+id);
  }
}
