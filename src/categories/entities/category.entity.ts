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
import { Service } from '../../services/entities/service.entity';
import { User } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

export const UNIQUE_CATEGORY_NAME_CONSTRAINT =
  'unique_category_name_constraint';

@Entity()
@Unique(UNIQUE_CATEGORY_NAME_CONSTRAINT, ['name'])
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToMany(() => Service, (service: Service) => service.categories)
  @JoinTable()
  public services: Service[];

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
