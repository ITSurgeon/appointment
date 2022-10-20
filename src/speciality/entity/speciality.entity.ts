import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../service/entity/service.entity';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['name'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class Speciality {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToMany(() => Service, (service: Service) => service.specialities)
  @JoinTable()
  public services: Service[];

  @ManyToMany(() => User, (user: User) => user.services)
  @JoinTable()
  public users: User[];

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;
}
