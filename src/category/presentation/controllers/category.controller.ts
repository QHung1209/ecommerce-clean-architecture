import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateCategoryUseCase } from 'src/category/application/use-cases/create-category.use-case';
import { GetCategoryUseCase } from 'src/category/application/use-cases/get-category.use-case';
import { ListCategoryUseCase } from 'src/category/application/use-cases/list-categories.use-case';
import { CategoryResponseMapper } from '../mappers/category-response.mapper';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryUseCase } from 'src/category/application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from 'src/category/application/use-cases/delete-category.use-case';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly listCategoryUseCase: ListCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  async listCategories(@Headers('Accept-Language') languageCode: string) {
    const categories = await this.listCategoryUseCase.execute(languageCode);
    return CategoryResponseMapper.toResponseList(categories);
  }

  @Get(':id')
  async getCategory(
    @Param() param: any,
    @Headers('Accept-Language') languageCode: string,
  ) {
    const category = await this.getCategoryUseCase.execute(param, languageCode);
    return CategoryResponseMapper.toResponse(category);
  }

  @Post()
  async createCategory(@Body() data: CreateCategoryDto, @Req() req: any) {
    const category = await this.createCategoryUseCase.execute(
      data,
      req.user.id,
    );
    return CategoryResponseMapper.toResponse(category);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() data: UpdateCategoryDto,
    @Req() req: any,
  ) {
    const category = await this.updateCategoryUseCase.execute(
      id,
      data,
      req.user.id,
    );
    return CategoryResponseMapper.toResponse(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number, @Req() req: any) {
    await this.deleteCategoryUseCase.execute(id, req.user.id);
  }
}
