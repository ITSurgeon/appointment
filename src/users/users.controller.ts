import { UsersService } from './users.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  getOneByID(@Param('id') id: string) {
    return this.usersService.getById(+id);
  }
}

// @Patch(":id")
// update(@Param("id") id: string, @Body() updateServiceDto: UpdateServiceDto) {
//   return this.usersService.update(+id, updateServiceDto);
// }

// @Delete(":id")
// remove(@Param("id") id: string) {
//   return this.usersService.remove(+id);
// }
