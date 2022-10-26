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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindManyAppointmentsQuery } from './dto/find-many-appointments.query';
import { AppointmentSearchResult } from '../types/appointmentSearchResult.interface';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  async findMany(
    @Query() query: FindManyAppointmentsQuery,
  ): Promise<AppointmentSearchResult> {
    const { totalCount, entities } =
      await this.appointmentService.findManyAppointments(query);

    return {
      data: entities,
      totalCount,
      currentPage: query.page || 1,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() appointment: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, appointment);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.appointmentService.remove(+id);
  }

  @Post(':id')
  restore(@Param('id') id: number) {
    return this.appointmentService.restoreDeletedAppointment(+id);
  }
}
