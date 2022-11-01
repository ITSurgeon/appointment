import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entity/service.entity';

export class CreateAppointmentDto {
  comment?: string;
  minCost?: string;
  dateTime?: Date;
  specificTimeSlotId: number;
  specialists: User[];
  clients: User[];
  services: Service[];
}
