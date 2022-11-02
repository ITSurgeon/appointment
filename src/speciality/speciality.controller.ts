import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { FindManySpecialitiesDto } from './dto/find-many-specialities.dto';
import { SpecialitySearchResultInterface } from '../types/specialitySearchResultInterface';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post()
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }

  @Get()
  async findMany(
    @Query() query: FindManySpecialitiesDto,
  ): Promise<SpecialitySearchResultInterface> {
    const { totalCount, entities } =
      await this.specialityService.findManySpecialities(query);

    return {
      specialities: entities,
      totalCount,
      currentPage: query.page || 1,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() speciality: UpdateSpecialityDto) {
    return this.specialityService.update(+id, speciality);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialityService.remove(+id);
  }

  @Post(':id')
  restore(@Param('id') id: string) {
    return this.specialityService.restoreDeletedSpeciality(+id);
  }
}
