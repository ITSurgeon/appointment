import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
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
      'specialists.id',
      'specialists.firstName',
      'specialists.lastName',
    ]);

    //  this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: UsualTimeSlotEntity[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOneUsualTimeslot(id: number): Promise<UsualTimeSlotEntity> {
    return await this.usualTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async updateUsualTimeslot(
    id: number,
    definition: DeepPartial<UsualTimeSlotEntity>,
  ): Promise<UsualTimeSlotEntity> {
    await this.usualTimeSlotRepository.update(id, definition);
    return await this.usualTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async removeUsualTimeslot(id: number): Promise<boolean> {
    const removeResponse: DeleteResult =
      await this.usualTimeSlotRepository.softDelete(id);
    return removeResponse.affected > 0;
  }

  async restoreUsualTimeslot(id: number): Promise<boolean> {
    const restoreResponse: UpdateResult =
      await this.usualTimeSlotRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return restoreResponse.affected > 0;
  }

  async createSpecificTimeSlot(definition): Promise<SpecificTimeSlotEntity[]> {
    const { specialistId, date } = definition;
    const dow = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
    const usualTimeSlots: UsualTimeSlotEntity[] =
      await this.usualTimeSlotRepository.find({
        relations: ['specialists'],
        where: {
          dayOfWeek: dow,
          specialists: [{ id: specialistId }],
        },
      });
    usualTimeSlots.forEach((usualTimeSlot) => {
      const newSlot: SpecificTimeSlotEntity =
        this.specificTimeSlotRepository.create({
          dateTimeStart: new Date(`${date}T${usualTimeSlot.timeStart}`),
          dateTimeEnd: new Date(`${date}T${usualTimeSlot.timeEnd}`),
          usualTimeSlots: [usualTimeSlot],
          specialists: [{ id: specialistId }],
        });
      this.specificTimeSlotRepository.save(newSlot);
    });
    return await this.specificTimeSlotRepository.find({
      relations: ['specialists', 'usualTimeSlots'],
      where: {
        specialists: { id: specialistId },
        usualTimeSlots: { dayOfWeek: dow },
      },
      order: {
        id: 'DESC',
      },
    });
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
      'specialists.comment',
      'appointments.id',
      'appointments.clients',
    ]);

    //this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: SpecificTimeSlotEntity[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOneSpecificTimeslot(id: number): Promise<SpecificTimeSlotEntity> {
    return await this.specificTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async updateSpecificTimeslot(
    id: number,
    definition: DeepPartial<SpecificTimeSlotEntity>,
  ): Promise<SpecificTimeSlotEntity> {
    await this.specificTimeSlotRepository.update(id, definition);
    return await this.specificTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async removeSpecificTimeslot(id: number): Promise<boolean> {
    const removeResponse: DeleteResult =
      await this.specificTimeSlotRepository.softDelete(id);
    return removeResponse.affected > 0;
  }

  async restoreSpecificTimeslot(id: number): Promise<boolean> {
    const restoreResponse: UpdateResult =
      await this.specificTimeSlotRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return restoreResponse.affected > 0;
  }
}
