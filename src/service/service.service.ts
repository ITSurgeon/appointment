import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
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
    return this.findMany(query, this.serviceRepository);
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
