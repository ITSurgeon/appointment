import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['name'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class Service {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public minCost: string;

  @ManyToMany(() => User, (user: User) => user.services)
  public users: User[];

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;
}
