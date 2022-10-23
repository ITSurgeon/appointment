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
import { Exclude } from 'class-transformer';
import { Service } from '../../service/entity/service.entity';
import { Speciality } from '../../speciality/entity/speciality.entity';

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
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public services: Service[];

  @ManyToMany(() => Speciality, (speciality: Speciality) => speciality.users, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public specialities: Speciality[];
}
