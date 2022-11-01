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
import { TimeSlotService } from './time-slot.service';
import { CreateUsualTimeSlotDto } from './dto/create-usual-time-slot.dto';
import { CreateSpecificTimeSlotDto } from './dto/create-specific-time-slot.dto';
import { FindManyTimeSlotsDto } from './dto/find-many-time-slots.dto';
import { UpdateAppointmentDto } from '../appointment/dto/update-appointment.dto';

@Controller('time-slot')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post('usual')
  createUsualTimeSlot(@Body() createUsualTimeSlotDto: CreateUsualTimeSlotDto) {
    return this.timeSlotService.createUsualTimeSlot(createUsualTimeSlotDto);
  }
  @Post('specific')
  createSpecificTimeSlot(
    @Body() createSpecificTimeSlotDto: CreateSpecificTimeSlotDto,
  ) {
    return this.timeSlotService.createSpecificTimeSlot(
      createSpecificTimeSlotDto,
    );
  }

  @Get('usual')
  async findManyUsualTimeSlots(@Query() query: FindManyTimeSlotsDto) {
    const { totalCount, entities } =
      await this.timeSlotService.findManyUsualTimeSlots(query);

    return {
      totalCount,
      currentPage: query.page || 1,
      timeSlots: entities,
    };
  }

  @Get('usual/:id')
  async findOneUsualTimeslot(@Param('id') id: number) {
    return await this.timeSlotService.findOneUsualTimeslot(id);
  }

  @Patch('usual/:id')
  updateUsualTimeslot(@Param('id') id: number, @Body() timeSlot) {
    return this.timeSlotService.updateUsualTimeslot(+id, timeSlot);
  }

  @Delete('usual/:id')
  removeUsualTimeslot(@Param('id') id: number) {
    return this.timeSlotService.removeUsualTimeslot(+id);
  }

  @Post('usual/:id')
  restoreUsualTimeslot(@Param('id') id: number) {
    return this.timeSlotService.restoreUsualTimeslot(+id);
  }

  @Get('specific')
  async findManySpecificTimeSlots(@Query() query: FindManyTimeSlotsDto) {
    const { totalCount, entities } =
      await this.timeSlotService.findManySpecificTimeSlots(query);

    return {
      totalCount,
      currentPage: query.page || 1,
      timeSlots: entities,
    };
  }

  @Get('specific/:id')
  async findOneSpecificTimeslot(@Param('id') id: number) {
    return await this.timeSlotService.findOneSpecificTimeslot(id);
  }

  @Patch('specific/:id')
  updateSpecificTimeslot(
    @Param('id') id: number,
    @Body() appointment: UpdateAppointmentDto,
  ) {
    return this.timeSlotService.updateSpecificTimeslot(+id, appointment);
  }

  @Delete('specific/:id')
  removeSpecificTimeslot(@Param('id') id: number) {
    return this.timeSlotService.removeSpecificTimeslot(+id);
  }

  @Post('specific/:id')
  restoreSpecificTimeslot(@Param('id') id: number) {
    return this.timeSlotService.restoreSpecificTimeslot(+id);
  }
}
