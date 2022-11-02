import { User } from '../../user/entities/user.entity';

export class CreateUsualTimeSlotDto {
  dayOfWeek: number;
  timeStart: Date;
  timeEnd: Date;
  specialists?: User[];
}
