import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Service } from '../../service/entity/service.entity';
import { Category } from '../../category/entity/category.entity';

@Entity()
@Index(['email'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'email' })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @DeleteDateColumn()
  @Exclude()
  public deletedAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ManyToMany(() => Service, (service: Service) => service.users, {
    cascade: true,
  })
  public services: Service[];

  @ManyToMany(() => Category, (category: Category) => category.services, {
    cascade: true,
  })
  public categories: Category[];

  // @Column({ default: false })
  // public phoneNumberConfirmed: boolean;
  //
  // @Column({ nullable: true })
  // public stars?: number;
  //
  // @Column({ nullable: true })
  // public birthday?: Date

  // @Column({ default: false })
  // public emailConfirmed: boolean;

  // @Column()
  // public role: string;
}
