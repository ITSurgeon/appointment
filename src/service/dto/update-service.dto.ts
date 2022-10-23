import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { DeepPartial } from 'typeorm';
import { Speciality } from '../../speciality/entity/speciality.entity';
import { User } from '../../user/entities/user.entity';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  id: number;
  specialities: [DeepPartial<Speciality>];
  users: [DeepPartial<User>];
}
