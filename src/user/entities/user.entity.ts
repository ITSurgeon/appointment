import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Service } from '../../service/entity/service.entity';
import { Speciality } from '../../speciality/entity/speciality.entity';
import { CommonEntity } from '../../common/common.entity';
import { Appointment } from '../../appointment/entity/appointment.entity';

@Entity()
@Index(['email'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class User extends CommonEntity {
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

  @ManyToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.specialists,
  )
  @JoinTable()
  public specialistAppointments: Appointment[];

  @ManyToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.clients,
  )
  @JoinTable()
  public clientAppointments: Appointment[];
}
