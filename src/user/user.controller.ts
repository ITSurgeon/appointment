import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { UserSearchResultInterface } from '../types/userSearchResult.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CookieAuthenticationGuard } from '../authentication/cookieAuthentication.guard';
import { ChangeRoleDto } from '../authentication/dto/change-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findMany(
    @Query() query: FindManyUsersDto,
  ): Promise<UserSearchResultInterface> {
    const { totalCount, entities } = await this.userService.findManyUsers(
      query,
    );

    return {
      data: entities,
      totalCount,
      currentPage: query.page || 1,
    };
  }

  @Get(':id')
  getOneByID(@Param('id') id: string) {
    return this.userService.getById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Patch(':id/become-specialist')
  async becomeSpecialist(
    @Param('id') id: number,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    return await this.userService.becomeSpecialist(id, changeRoleDto);
  }
}
