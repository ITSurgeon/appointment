import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Speciality } from '../../speciality/entity/speciality.entity';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

export const UNIQUE_SERVICE_NAME_CONSTRAINT = 'unique_service_name_constraint';

@Entity()
@Unique(UNIQUE_SERVICE_NAME_CONSTRAINT, ['name'])
export class Service {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public minCost: string;

  @ManyToMany(() => Speciality, (speciality: Speciality) => speciality.services)
  public specialities: Speciality[];

  @ManyToMany(() => User, (user: User) => user.services)
  @JoinTable()
  public users: User[];

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;
}
