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
import { CreateCategoryTranslationUseCase } from 'src/category/application/use-cases/translation/create-category-translation.use-case';
import { CategoryTranslationResponseMapper } from '../mappers/category-translation-response.mapper';
import { ListCategoryTranslationsUseCase } from 'src/category/application/use-cases/translation/list-category-translations.use-case';
import { DeleteCategoryTranslationUseCase } from 'src/category/application/use-cases/translation/delete-category-translation.use-case';
import { UpdateCategoryTranslationUseCase } from 'src/category/application/use-cases/translation/update-category-translation.use-case';
import { GetCategoryTranslationUseCase } from 'src/category/application/use-cases/translation/get-category-translation.use-case';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { CreateCategoryTranslationDto } from '../dto/create-category-translation.dto';
import { UpdateCategoryTranslationDto } from '../dto/update-category-translation.dto';
import { ListCategoryTranslationDto } from '../dto/list-category-translation.dto';

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(
    private readonly createCategoryTranslationUseCase: CreateCategoryTranslationUseCase,
    private readonly listCategoryTranslationsUseCase: ListCategoryTranslationsUseCase,
    private readonly deleteCategoryTranslationUseCase: DeleteCategoryTranslationUseCase,
    private readonly updateCategoryTranslationUseCase: UpdateCategoryTranslationUseCase,
    private readonly getCategoryTranslationUseCase: GetCategoryTranslationUseCase,
  ) {}

  @Get()
  async listCategoryTranslations(
    @Query() query: ListCategoryTranslationDto,
  ) {
    const categoryTranslations =
      await this.listCategoryTranslationsUseCase.execute(
        query.categoryId,
        query,
      );
    return CategoryTranslationResponseMapper.toPaginatedResponse(
      categoryTranslations,
    );
  }

  @Get(':id')
  async getCategoryTranslation(@Param('id') id: number) {
    const categoryTranslation =
      await this.getCategoryTranslationUseCase.execute(id);
    return CategoryTranslationResponseMapper.toResponse(categoryTranslation);
  }

  @Post()
  async createCategoryTranslation(
    @Body() data: CreateCategoryTranslationDto,
    @Req() req: any,
  ) {
    const categoryTranslation =
      await this.createCategoryTranslationUseCase.execute(data, req.user.id);
    return CategoryTranslationResponseMapper.toResponse(categoryTranslation);
  }

  @Put(':id')
  async updateCategoryTranslation(
    @Param('id') id: number,
    @Body() data: UpdateCategoryTranslationDto,
    @Req() req: any,
  ) {
    const categoryTranslation =
      await this.updateCategoryTranslationUseCase.execute(
        id,
        data,
        req.user.id,
      );
    return CategoryTranslationResponseMapper.toResponse(categoryTranslation);
  }

  @Delete(':id')
  async deleteCategoryTranslation(@Param('id') id: number, @Req() req: any) {
    await this.deleteCategoryTranslationUseCase.execute(id, req.user.id);
  }
}
