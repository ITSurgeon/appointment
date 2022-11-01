import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { SpecificTimeslot } from '../time-slot/entity/specific-time-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, SpecificTimeslot])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
