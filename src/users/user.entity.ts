import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
export const UNIQUE_USER_EMAIL_CONSTRAINT = 'unique_user_email_constraint';

@Entity()
@Unique(UNIQUE_USER_EMAIL_CONSTRAINT, ['email'])
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'email', unique: true })
  public email: string;

  @Column()
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
}
