import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointment/entity/appointment.entity';

export class FindManyTimeSlotsDto {
  page?: number;
  limit?: number;
  dayOfWeek?: number;
  timeStart?: Date;
  timeEnd?: Date;
  working?: boolean;
  available?: boolean;
  specialists?: User[];
  appointments?: Appointment[];
}
