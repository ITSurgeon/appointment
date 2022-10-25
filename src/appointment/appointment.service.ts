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

  async create(definition: DeepPartial<Appointment>) {
    return await this.appointmentRepository.save(definition);
  }

  async findManyAppointments(
    query,
  ): Promise<{ entities: Appointment[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, client, specialist, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { client, specialist };

    const builder: SelectQueryBuilder<Appointment> =
      this.appointmentRepository.createQueryBuilder('appointment');

    builder.leftJoinAndSelect('appointment.client', 'client');
    builder.leftJoinAndSelect('appointment.specialist', 'specialist');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'appointment.date',
      'appointment.timeStart',
      'appointment.comment',
      'appointment.id',
      'client.id',
      'client.firstName',
      'client.lastName',
      'specialist.id',
      'specialist.firstName',
      'specialist.lastName',
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
        relations: ['specialist', 'client'],
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
        relations: ['specialist', 'client'],
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
