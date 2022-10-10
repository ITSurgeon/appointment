import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationQuery } from '../common/pagination.query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async search(query: PaginationQuery) {
    const newQuery = { page: 1, limit: 9, ...query };
    const { search, limit, page, ...where } = newQuery;
    const skip = (page - 1) * limit;

    const builder = this.userRepository.createQueryBuilder('user').where(where);

    if (search?.trim()?.length > 0) {
      builder.andWhere('email ilike :search', {
        search: `%${query.search.trim()}%`,
      });
    }

    const totalCount = await builder.getCount();

    builder.offset(skip);
    builder.limit(limit);

    const users: User[] = await builder.getMany();

    return { totalCount, users };
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
