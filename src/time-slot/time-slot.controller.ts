import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { CreateUsualTimeSlotDto } from './dto/create-usual-time-slot.dto';
import { CreateSpecificTimeSlotDto } from './dto/create-specific-time-slot.dto';
import { FindManyTimeSlotsDto } from './dto/find-many-time-slots.dto';

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
}
