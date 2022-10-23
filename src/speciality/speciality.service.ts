import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Speciality } from './entity/speciality.entity';
import {
  DeepPartial,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { EntityService } from '../common/entity.service';

@Injectable()
export class SpecialityService extends EntityService {
  constructor(
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>,
  ) {
    super();
  }

  async create(definition: DeepPartial<Speciality>): Promise<Speciality> {
    const count = await this.specialityRepository.count({
      where: { name: definition.name },
    });

    if (count > 0) {
      throw new HttpException(
        `Speciality ${definition.name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.specialityRepository.save(definition);
  }

  async findManySpecialities(
    query,
  ): Promise<{ entities: Speciality[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { users: userId };

    const builder: SelectQueryBuilder<Speciality> =
      this.specialityRepository.createQueryBuilder('speciality');

    builder.leftJoinAndSelect('speciality.users', 'users');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'speciality.name',
      'speciality.id',
      'users.id',
      'users.firstName',
      'users.lastName',
    ]);

    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: Speciality[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOne(id: number): Promise<Speciality> {
    const speciality: Speciality | null =
      await this.specialityRepository.findOne({
        where: { id },
        relations: ['users'],
      });
    if (speciality) {
      return speciality;
    }
    throw new NotFoundException();
  }

  async update(
    id: number,
    definition: DeepPartial<Speciality>,
  ): Promise<Speciality> {
    await this.specialityRepository.update(id, definition);
    const updatedSpeciality: Speciality | null =
      await this.specialityRepository.findOne({
        where: { id },
        relations: ['users'],
      });
    if (updatedSpeciality) {
      return updatedSpeciality;
    }
    throw new NotFoundException();
  }

  async remove(id: number): Promise<boolean> {
    const result: DeleteResult = await this.specialityRepository.softDelete(id);
    return !!result.affected;
  }

  async restoreDeletedSpeciality(id: number): Promise<string> {
    const restoreResponse: UpdateResult =
      await this.specialityRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return `Speciality with id: ${id} restored`;
  }
}
