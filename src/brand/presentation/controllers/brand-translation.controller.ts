import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateBrandTranslationUseCase } from 'src/brand/application/use-cases/translation/create-brand-translation.use-case';
import { GetBrandTranslationUseCase } from 'src/brand/application/use-cases/translation/get-brand-translation.use-case';
import { ListBrandTranslationsUseCase } from 'src/brand/application/use-cases/translation/list-brand-translations.use-case';
import { UpdateBrandTranslationUseCase } from 'src/brand/application/use-cases/translation/update-brand-translation.use-case';
import { DeleteBrandTranslationUseCase } from 'src/brand/application/use-cases/translation/delete-brand-translation.use-case';
import { BrandTranslationResponseMapper } from '../mappers/brand-translation-response.mapper';
import { CreateBrandTranslationDto } from '../dto/create-brand-translation.dto';
import { UpdateBrandTranslationDto } from '../dto/update-brand-translation.dto';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { ListBrandTranslationDto } from '../dto/list-brand-translation.dto';

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(
    private readonly createBrandTranslationUseCase: CreateBrandTranslationUseCase,
    private readonly getBrandTranslationUseCase: GetBrandTranslationUseCase,
    private readonly listBrandTranslationsUseCase: ListBrandTranslationsUseCase,
    private readonly updateBrandTranslationUseCase: UpdateBrandTranslationUseCase,
    private readonly deleteBrandTranslationUseCase: DeleteBrandTranslationUseCase,
  ) {}

  @Get()
  async listBrandTranslations(
    @Query() query: ListBrandTranslationDto,
  ) {
    const brandTranslations = await this.listBrandTranslationsUseCase.execute(
      query.brandId,
      query,
    );
    return BrandTranslationResponseMapper.toPaginatedResponse(
      brandTranslations,
    );
  }

  @Get(':id')
  async getBrandTranslation(@Param('id') id: number) {
    const brandTranslation = await this.getBrandTranslationUseCase.execute(id);
    return BrandTranslationResponseMapper.toResponse(brandTranslation);
  }

  @Post()
  async createBrandTranslation(
    @Body() data: CreateBrandTranslationDto,
    @Req() req: any,
  ) {
    const brandTranslation = await this.createBrandTranslationUseCase.execute(
      data,
      req.user.id,
    );
    return BrandTranslationResponseMapper.toResponse(brandTranslation);
  }

  @Put(':id')
  async updateBrandTranslation(
    @Param('id') id: number,
    @Body() data: UpdateBrandTranslationDto,
    @Req() req: any,
  ) {
    const brandTranslation = await this.updateBrandTranslationUseCase.execute(
      id,
      data,
      req.user.id,
    );
    return BrandTranslationResponseMapper.toResponse(brandTranslation);
  }

  @Delete(':id')
  async deleteBrandTranslation(@Param('id') id: number, @Req() req: any) {
    await this.deleteBrandTranslationUseCase.execute(id, req.user.id);
  }
}
