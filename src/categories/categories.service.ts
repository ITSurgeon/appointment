import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  UNIQUE_CATEGORY_NAME_CONSTRAINT,
} from './entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(category: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory: Category = this.categoriesRepository.create(category);
      await this.categoriesRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      if (error?.constraint === UNIQUE_CATEGORY_NAME_CONSTRAINT) {
        throw new HttpException(
          'Category with that name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new Error('Something went wrong');
    }
  }

  findAll() {
    return this.categoriesRepository.find({ relations: ['services', 'users'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['services', 'users'],
    });
    if (category) {
      return category;
    }
    throw new NotFoundException();
  }

  async update(id: number, category: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new NotFoundException();
  }

  async remove(id: number) {
    const deleteResponse = await this.categoriesRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(id);
    }
  }
}
