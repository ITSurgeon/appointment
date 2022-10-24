import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import {
  DeepPartial,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { EntityService } from '../common/entity.service';

@Injectable()
export class AppointmentService extends EntityService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {
    super();
  }

  async create(definition: DeepPartial<Appointment>): Promise<Appointment> {
    return await this.appointmentRepository.save(definition);
  }

  async findManyAppointments(
    query,
  ): Promise<{ entities: Appointment[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { users: userId };

    const builder: SelectQueryBuilder<Appointment> =
      this.appointmentRepository.createQueryBuilder('appointment');

    builder.leftJoinAndSelect('appointment.users', 'users');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'appointment.name',
      'appointment.id',
      'users.id',
      'users.firstName',
      'users.lastName',
    ]);

    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: Appointment[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment: Appointment | null =
      await this.appointmentRepository.findOne({
        where: { id },
        relations: ['specialistId', 'clientId'],
      });
    if (appointment) {
      return appointment;
    }
    throw new NotFoundException();
  }

  async update(
    id: number,
    definition: DeepPartial<Appointment>,
  ): Promise<Appointment> {
    await this.appointmentRepository.update(id, definition);
    const updatedAppointment: Appointment | null =
      await this.appointmentRepository.findOne({
        where: { id },
        relations: ['users'],
      });
    if (updatedAppointment) {
      return updatedAppointment;
    }
    throw new NotFoundException();
  }

  async remove(id: number): Promise<boolean> {
    const result: DeleteResult = await this.appointmentRepository.softDelete(
      id,
    );
    return !!result.affected;
  }

  async restoreDeletedAppointment(id: number): Promise<string> {
    const restoreResponse: UpdateResult =
      await this.appointmentRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return `Appointment with id: ${id} restored`;
  }
}
