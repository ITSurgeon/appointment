import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindManyAppointmentsQuery } from './dto/find-many-appointments.query';
import { AppointmentSearchResult } from '../types/appointmentSearchResult.interface';
import { CookieAuthenticationGuard } from '../authentication/cookieAuthentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post()
  create(
    @Req() request: RequestWithUser,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.create(request.user, createAppointmentDto);
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async findMany(
    @Req() request: RequestWithUser,
    @Query() query: FindManyAppointmentsQuery,
  ): Promise<AppointmentSearchResult> {
    const { totalCount, entities } =
      await this.appointmentService.findManyAppointments(request.user, query);

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
