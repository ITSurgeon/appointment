import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { PaginationQuery } from '../common/pagination.query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const { totalCount, users } = await this.userService.search(query);

    return {
      data: {
        users,
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

// @Patch(":id")
// update(@Param("id") id: string, @Body() updateServiceDto: UpdateServiceDto) {
//   return this.userService.update(+id, updateServiceDto);
// }

// @Delete(":id")
// remove(@Param("id") id: string) {
//   return this.userService.remove(+id);
// }
