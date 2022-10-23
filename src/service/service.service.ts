import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Service } from './entity/service.entity';
import { EntityService } from '../common/entity.service';

@Injectable()
export class ServiceService extends EntityService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {
    super();
  }

  async create(definition: DeepPartial<Service>): Promise<Service> {
    const count = await this.serviceRepository.count({
      where: { name: definition.name },
    });

    if (count > 0) {
      throw new HttpException(
        `Service ${definition.name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.serviceRepository.save(definition);
  }

  async findManyServices(
    query,
  ): Promise<{ entities: Service[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, userId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { users: userId };

    const builder: SelectQueryBuilder<Service> =
      this.serviceRepository.createQueryBuilder('service');

    builder.leftJoinAndSelect('service.users', 'users');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }

    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'service.name',
      'service.id',
      'users.id',
      'users.firstName',
      'users.lastName',
    ]);

    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: Service[] = await builder.getMany();
    return { totalCount, entities };
  }

  async findOne(id: number): Promise<Service> {
    const service: Service | null = await this.serviceRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (service) {
      return service;
    }
    throw new NotFoundException();
  }

  async update(id: number, definition: DeepPartial<Service>) {
    await this.serviceRepository.update(id, definition);
    const updatedService: Service | null = await this.serviceRepository.findOne(
      {
        where: { id },
        relations: ['users'],
      },
    );
    if (updatedService) {
      return updatedService;
    }
    throw new NotFoundException();
  }

  async remove(id: number) {
    const result: DeleteResult = await this.serviceRepository.softDelete(id);
    return !!result.affected;
  }
}
