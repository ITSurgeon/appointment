import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';
import { Service } from '../../service/entity/service.entity';

@Entity()
export class Appointment extends CommonEntity {
  @Column({ nullable: true })
  public comment: string;

  @Column({ nullable: true })
  public minCost: string;

  @Column({ nullable: true })
  public date: Date;

  // @Column({ nullable: true })
  // public timeStart: Timestamp;

  @ManyToOne(() => User, (user: User) => user.specialistAppointments, {
    eager: true,
    cascade: true,
  })
  public specialist: User;

  @ManyToOne(() => User, (user: User) => user.clientAppointments, {
    eager: true,
    cascade: true,
  })
  public client: User;

  @ManyToMany(() => Service, (service: Service) => service.appointments, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public service: Service;
}
