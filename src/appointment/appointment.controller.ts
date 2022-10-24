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
import { Appointment } from './entity/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindManyAppointmentsDto } from './dto/find-many-appointments.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  async findMany(@Query() query: FindManyAppointmentsDto): Promise<{
    data: { appointments: Appointment[]; totalCount: any; currentPage: number };
  }> {
    const { totalCount, entities } =
      await this.appointmentService.findManyAppointments(query);

    return {
      data: {
        appointments: entities,
        totalCount,
        currentPage: query.page || 1,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() appointment: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, appointment);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Post(':id')
  restore(@Param('id') id: string) {
    return this.appointmentService.restoreDeletedAppointment(+id);
  }
}
