import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { DeepPartial } from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { User } from '../../user/entities/user.entity';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  id: number;
  categories: [DeepPartial<Category>];
  users: [DeepPartial<User>];
}
