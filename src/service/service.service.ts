import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { Service } from './entity/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(definition: DeepPartial<Service>): Promise<Service> {
    const candidate: Service = await this.serviceRepository.findOne({
      where: { name: definition.name },
    });
    if (candidate) {
      throw new HttpException(
        `Service ${definition.name} already exists, id: ${candidate.id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.serviceRepository.save(definition);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['categories', 'users'],
    });
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
