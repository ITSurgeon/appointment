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
import { SpecificTimeSlotEntity } from '../time-slot/entity/specific-time-slot.entity';

@Injectable()
export class AppointmentService extends EntityService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(SpecificTimeSlotEntity)
    private specificTimeSlotRepository: Repository<SpecificTimeSlotEntity>,
  ) {
    super();
  }

  async create(definition): Promise<Appointment> {
    const { specificTimeSlotId, clientId, specialistId, serviceId, comment } =
      definition;
    const appointment: Appointment = this.appointmentRepository.create({
      clients: [{ id: clientId }],
      specialists: [{ id: specialistId }],
      services: [{ id: serviceId }],
      specificTimeSlots: [{ id: specificTimeSlotId }],
      comment,
    });
    await this.specificTimeSlotRepository.update(
      { id: specificTimeSlotId },
      {
        available: false,
      },
    );
    return this.appointmentRepository.save(appointment);
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

    builder.leftJoinAndSelect('appointment.clients', 'clients');
    builder.leftJoinAndSelect('appointment.specialists', 'specialists');
    builder.leftJoinAndSelect('appointment.services', 'services');
    builder.leftJoinAndSelect(
      'appointment.specificTimeSlots',
      'specificTimeSlots',
    );

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'appointment.dateTime',
      'appointment.comment',
      'appointment.id',
      'clients.id',
      'clients.firstName',
      'clients.lastName',
      'specialists.id',
      'specialists.firstName',
      'specialists.lastName',
      'services.id',
      'services.name',
      'services.description',
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
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['specialist', 'client'],
    });
  }

  async remove(id: number): Promise<boolean> {
    const restoreResponse: DeleteResult =
      await this.appointmentRepository.softDelete(id);
    return restoreResponse.affected > 0;
  }

  async restoreDeletedAppointment(id: number): Promise<boolean> {
    const restoreResponse: UpdateResult =
      await this.appointmentRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return restoreResponse.affected > 0;
  }
}
