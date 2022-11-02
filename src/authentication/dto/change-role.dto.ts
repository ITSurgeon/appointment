import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  specialityId: number;

  serviceId: number;
}
