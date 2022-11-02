import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsualTimeslot } from './entity/usual-time-slot.entity';
import { SpecificTimeslot } from './entity/specific-time-slot.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsualTimeslot, SpecificTimeslot]),
    JwtModule,
  ],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
