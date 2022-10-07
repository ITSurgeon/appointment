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
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { PaginationQuery } from '../common/pagination.query.dto';

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

  async search(query: PaginationQuery) {
    const newQuery = { page: 1, limit: 9, ...query };
    const { search, limit, page, ...where } = newQuery;
    const skip = (page - 1) * limit;

    const builder: SelectQueryBuilder<Category> = this.categoryRepository
      .createQueryBuilder()
      .where(where);

    if (search?.trim()?.length > 0) {
      builder.andWhere('name ilike :search', {
        search: `%${query.search.trim()}%`,
      });
    }

    const totalCount = await builder.getCount();

    builder.offset(skip);
    builder.limit(limit);

    const categories: Category[] = await builder.getMany();

    return { totalCount, categories };
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
