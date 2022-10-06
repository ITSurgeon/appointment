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
  FindManyOptions,
  MoreThan,
  Repository,
} from 'typeorm';
import { Service } from './entity/service.entity';
import { Category } from '../category/entity/category.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

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

  async findAll(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Category>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.serviceRepository.count();
    }

    const [items, count] = await this.serviceRepository.findAndCount({
      where,
      relations: ['services', 'users'],
      order: {
        id: 'ASC',
      },
      skip: offset || 0,
      take: limit || 10,
    });

    return {
      count: startId ? separateCount : count,
      items,
    };
  }

  async findOne(id: number): Promise<Service> {
    const service: Service | null = await this.serviceRepository.findOne({
      where: { id },
      relations: ['categories', 'users'],
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
        relations: ['categories'],
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
