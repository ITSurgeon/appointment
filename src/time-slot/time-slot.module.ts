import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsualTimeSlotEntity } from './entity/usual-time-slot.entity';
import { SpecificTimeSlotEntity } from './entity/specific-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsualTimeSlotEntity, SpecificTimeSlotEntity]),
  ],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
