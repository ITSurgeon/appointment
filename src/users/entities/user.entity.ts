import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Service } from '../../services/entities/service.entity';
import { Category } from '../../categories/entities/category.entity';

export const UNIQUE_USER_EMAIL_CONSTRAINT = 'unique_user_email_constraint';

@Entity()
@Unique(UNIQUE_USER_EMAIL_CONSTRAINT, ['email'])
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'email' })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  // @Column({ default: false })
  // public emailConfirmed: boolean;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  // @Column()
  // public role: string;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column({ nullable: true })
  public phoneNumber?: string;

  // @Column({ default: false })
  // public phoneNumberConfirmed: boolean;
  //
  // @Column({ nullable: true })
  // public stars?: number;
  //
  // @Column({ nullable: true })
  // public birthday?: Date;
  //
  // @Column()
  // @CreateDateColumn()
  // createdAt: Date;
  //
  // @Column()
  // @UpdateDateColumn()
  // updatedAt: Date;

  //   @BeforeInsert()
  //   async hashPassword() {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  //
  //   async validatePassword(password: string): Promise<boolean> {
  //     return bcrypt.compare(password, this.password);
  //   }

  @ManyToMany(() => Service, (service: Service) => service.users)
  public services: Service[];

  @ManyToMany(() => Category, (category: Category) => category.services)
  public categories: Category[];
}
