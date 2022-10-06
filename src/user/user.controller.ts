import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  getAll(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('startId') startId?: number,
  ) {
    return this.userService.getAll(offset, limit, startId);
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
