import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { UsualTimeslot } from './entity/usual-time-slot.entity';
import { SpecificTimeslot } from './entity/specific-time-slot.entity';
import { EntityService } from '../common/entity.service';

@Injectable()
export class TimeSlotService extends EntityService {
  constructor(
    @InjectRepository(UsualTimeslot)
    private usualTimeSlotRepository: Repository<UsualTimeslot>,
    @InjectRepository(SpecificTimeslot)
    private specificTimeSlotRepository: Repository<SpecificTimeslot>,
  ) {
    super();
  }

  async createUsualTimeSlot(userId, timeSlots) {
    for (const timeSlot of timeSlots) {
      timeSlot.specialists = [{ id: userId }];
      await this.usualTimeSlotRepository.save(timeSlot);
    }
    return this.usualTimeSlotRepository.find({
      relations: ['specialists'],
      where: { specialists: { id: userId } },
      select: {
        id: true,
        dayOfWeek: true,
        timeStart: true,
        timeEnd: true,
        specialists: { id: true, firstName: true, lastName: true },
      },
    });
  }

  async findManyUsualTimeSlots(
    query,
  ): Promise<{ entities: UsualTimeslot[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { specialists: userId };

    const builder: SelectQueryBuilder<UsualTimeslot> =
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

    const totalCount = await builder.getCount();
    const entities: UsualTimeslot[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOneUsualTimeslot(id: number): Promise<UsualTimeslot> {
    return await this.usualTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async updateUsualTimeslot(
    id: number,
    definition: DeepPartial<UsualTimeslot>,
  ): Promise<UsualTimeslot> {
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

  async createSpecificTimeSlot(definition): Promise<SpecificTimeslot[]> {
    const { specialistId, date } = definition;
    const dow = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
    const usualTimeSlots: UsualTimeslot[] =
      await this.usualTimeSlotRepository.find({
        relations: ['specialists'],
        where: {
          dayOfWeek: dow,
          specialists: [{ id: specialistId }],
        },
      });
    for (const usualTimeSlot of usualTimeSlots) {
      const newSlot: SpecificTimeslot = this.specificTimeSlotRepository.create({
        dateTimeStart: new Date(`${date}T${usualTimeSlot.timeStart}`),
        dateTimeEnd: new Date(`${date}T${usualTimeSlot.timeEnd}`),
        usualTimeSlots: [{ id: usualTimeSlot.id }],
        specialists: [{ id: specialistId }],
      });
      await this.specificTimeSlotRepository.save(newSlot);
    }
    return await this.specificTimeSlotRepository.find({
      relations: ['specialists', 'usualTimeSlots'],
      where: {
        specialists: [{ id: specialistId }],
        usualTimeSlots: [{ dayOfWeek: dow }],
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findManySpecificTimeSlots(
    query,
  ): Promise<{ entities: SpecificTimeslot[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { users: userId };

    const builder: SelectQueryBuilder<SpecificTimeslot> =
      this.specificTimeSlotRepository.createQueryBuilder('specificTimeSlot');

    builder.leftJoinAndSelect('specificTimeSlot.specialists', 'specialists');
    // builder.leftJoinAndSelect('specificTimeSlot.appointments', 'appointments');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }
    builder.select([
      'specificTimeSlot.id',
      'specificTimeSlot.dateTimeStart',
      'specificTimeSlot.dateTimeEnd',
      'specificTimeSlot.working',
      'specificTimeSlot.available',
      'specialists.id',
      'specialists.firstName',
      'specialists.lastName',
    ]);

    const totalCount = await builder.getCount();
    const entities: SpecificTimeslot[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOneSpecificTimeslot(id: number): Promise<SpecificTimeslot> {
    return await this.specificTimeSlotRepository.findOne({
      where: { id },
      relations: ['specialists'],
    });
  }

  async updateSpecificTimeslot(
    id: number,
    definition: DeepPartial<SpecificTimeslot>,
  ): Promise<SpecificTimeslot> {
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
