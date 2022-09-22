import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public emailConfirmed: boolean;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column()
  public role: string;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ default: false })
  public phoneNumberConfirmed: boolean;

  @Column({ nullable: true })
  public stars?: number;

  @Column({ nullable: true })
  public birthday?: Date;
}

export default User;
