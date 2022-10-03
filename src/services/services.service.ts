import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Service,
  UNIQUE_SERVICE_NAME_CONSTRAINT,
} from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      const newService: Service =
        this.servicesRepository.create(createServiceDto);
      await this.servicesRepository.save(newService);
      return newService;
    } catch (error) {
      if (error?.constraint === UNIQUE_SERVICE_NAME_CONSTRAINT) {
        throw new HttpException(
          'Service with that name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new Error('Something went wrong');
    }
  }

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
