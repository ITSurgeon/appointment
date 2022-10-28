import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { UsualTimeSlotEntity } from './entity/usual-time-slot.entity';
import { SpecificTimeSlotEntity } from './entity/specific-time-slot.entity';
import { EntityService } from '../common/entity.service';

@Injectable()
export class TimeSlotService extends EntityService {
  constructor(
    @InjectRepository(UsualTimeSlotEntity)
    private usualTimeSlotRepository: Repository<UsualTimeSlotEntity>,
    @InjectRepository(SpecificTimeSlotEntity)
    private specificTimeSlotRepository: Repository<SpecificTimeSlotEntity>,
  ) {
    super();
  }

  async createUsualTimeSlot(
    definition: DeepPartial<UsualTimeSlotEntity>,
  ): Promise<UsualTimeSlotEntity> {
    return await this.usualTimeSlotRepository.save(definition);
  }
  async createSpecificTimeSlot(
    definition: DeepPartial<SpecificTimeSlotEntity>,
  ): Promise<SpecificTimeSlotEntity> {
    return await this.specificTimeSlotRepository.save(definition);
  }

  async findManyUsualTimeSlots(
    query,
  ): Promise<{ entities: UsualTimeSlotEntity[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { specialists: userId };

    const builder: SelectQueryBuilder<UsualTimeSlotEntity> =
      this.usualTimeSlotRepository.createQueryBuilder('usualTimeSlot');

    builder.leftJoinAndSelect('usualTimeSlot.specialists', 'specialists');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'usualTimeSlot.id',
      'usualTimeSlot.dayOfWeek',
      'usualTimeSlot.timeStart',
      'usualTimeSlot.timeEnd',
      // 'specialists.id',
      // 'specialists.firstName',
      // 'specialists.lastName',
    ]);

    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: UsualTimeSlotEntity[] = await builder.getMany();
    return { totalCount, entities };
  }
  async findManySpecificTimeSlots(
    query,
  ): Promise<{ entities: SpecificTimeSlotEntity[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { users: userId };

    const builder: SelectQueryBuilder<SpecificTimeSlotEntity> =
      this.specificTimeSlotRepository.createQueryBuilder('specificTimeSlot');

    builder.leftJoinAndSelect('specificTimeSlot.specialists', 'specialists');
    builder.leftJoinAndSelect('specificTimeSlot.appointments', 'appointments');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'specificTimeSlot.id',
      'specificTimeSlot.dayOfWeek',
      'specificTimeSlot.timeStart',
      'specificTimeSlot.timeEnd',
      'specialists.id',
      'specialists.firstName',
      'specialists.lastName',
      'appointments.id',
      'appointments.clients',
      'specialists.comment',
    ]);

    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: SpecificTimeSlotEntity[] = await builder.getMany();
    return { totalCount, entities };
  }
}
