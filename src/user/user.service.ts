import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import { EntityService } from '../common/entity.service';

@Injectable()
export class UserService extends EntityService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super();
  }

  async findManyUsers(
    query,
  ): Promise<{ entities: User[]; totalCount: number }> {
    const preQuery = { page: 1, limit: 9, ...query };
    const { page, limit, specialityId, serviceId, ...columnsQuery } = preQuery;

    const paginationQuery = { page, limit };

    const relationsQuery = { specialities: specialityId, services: serviceId };

    const builder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user');

    builder.leftJoinAndSelect('user.specialities', 'specialities');
    builder.leftJoinAndSelect('user.services', 'services');

    if (relationsQuery && Object.keys(relationsQuery).length > 0) {
      this.filterByRelation(builder, relationsQuery);
    }
    if (columnsQuery && Object.keys(columnsQuery).length > 0) {
      this.filterByColumn(builder, columnsQuery);
    }

    builder.select([
      'user.firstName',
      'user.lastName',
      'user.id',
      'specialities.id',
      'specialities.name',
      'services.id',
      'services.name',
    ]);
    this.paginate(builder, paginationQuery);
    const totalCount = await builder.getCount();
    const entities: User[] = await builder.getMany();
    return { totalCount, entities };
  }

  async getByEmail(email: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(definition: DeepPartial<User>): Promise<User> {
    const count = await this.userRepository.count({
      where: { email: definition.email },
    });

    if (count > 0) {
      throw new HttpException(
        `User with email ${definition.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.save(definition);
  }
}
