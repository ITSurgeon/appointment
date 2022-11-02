import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class CommonEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
