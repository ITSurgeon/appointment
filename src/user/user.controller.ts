import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { FindManyUsersDto } from './dto/find-many-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findMany(@Query() query: FindManyUsersDto) {
    const { totalCount, entities } = await this.userService.findManyUsers(
      query,
    );

    return {
      data: {
        users: entities,
        totalCount,
        currentPage: query.page || 1,
      },
    };
  }

  @Get(':id')
  getOneByID(@Param('id') id: string) {
    return this.userService.getById(+id);
  }
}
