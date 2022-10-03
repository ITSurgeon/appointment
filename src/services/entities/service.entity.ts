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
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
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

  @ManyToMany(() => Category, (category: Category) => category.services)
  public categories: Category[];

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
