import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entity/service.entity';

export class CreateAppointmentDto {
  comment?: string;
  minCost?: string;
  date: Date;
  timeStart?: Date;
  specialist: User[];
  client: User[];
  service: Service[];
}
