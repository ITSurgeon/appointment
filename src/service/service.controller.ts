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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entity/service.entity';
import { PaginationQuery } from '../common/pagination.query.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const { totalCount, services } = await this.serviceService.search(query);

    return {
      data: {
        services,
        totalCount,
        currentPage: query.page || 1,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Service> {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
