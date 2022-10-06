import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(definition: DeepPartial<Category>): Promise<Category> {
    const count = await this.categoryRepository.count({
      where: { name: definition.name },
    });

    if (count > 0) {
      throw new HttpException(
        `Category ${definition.name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.categoryRepository.save(definition);
  }

  async findAll(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Category>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.categoryRepository.count();
    }

    // if (offset || limit) {
    const [items, count] = await this.categoryRepository.findAndCount({
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

  async findOne(id: number): Promise<Category> {
    const category: Category | null = await this.categoryRepository.findOne({
      where: { id },
      relations: ['services', 'users'],
    });
    if (category) {
      return category;
    }
    throw new NotFoundException();
  }

  async update(
    id: number,
    definition: DeepPartial<Category>,
  ): Promise<Category> {
    await this.categoryRepository.update(id, definition);
    const updatedCategory: Category | null =
      await this.categoryRepository.findOne({
        where: { id },
        relations: ['services'],
      });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new NotFoundException();
  }

  async remove(id: number): Promise<boolean> {
    const result: DeleteResult = await this.categoryRepository.softDelete(id);
    return !!result.affected;
  }

  async restoreDeletedCategory(id: number): Promise<string> {
    const restoreResponse: UpdateResult = await this.categoryRepository.restore(
      id,
    );
    if (!restoreResponse.affected) {
      throw new NotFoundException(id);
    }
    return `Category with id: ${id} restored`;
  }
}
