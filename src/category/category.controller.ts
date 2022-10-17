import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entity/category.entity';
import { FindManyCategoriesDto } from './dto/find-many-categories.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findMany(@Query() query: FindManyCategoriesDto): Promise<{
    data: { categories: Category[]; totalCount: any; currentPage: number };
  }> {
    const { totalCount, entities } =
      await this.categoryService.findManyCategories(query);

    return {
      data: {
        categories: entities,
        totalCount,
        currentPage: query.page || 1,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() category: UpdateCategoryDto) {
    return this.categoryService.update(+id, category);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

  @Post(':id')
  restore(@Param('id') id: string) {
    return this.categoryService.restoreDeletedCategory(+id);
  }
}
