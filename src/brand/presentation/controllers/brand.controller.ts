import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateBrandUseCase } from 'src/brand/application/use-cases/create-brand.use-case';
import { GetBrandUseCase } from 'src/brand/application/use-cases/get-brand.use-case';
import { ListBrandsUseCase } from 'src/brand/application/use-cases/list-brands.use-case';
import { UpdateBrandUseCase } from 'src/brand/application/use-cases/update-brand.use-case';
import { DeleteBrandUseCase } from 'src/brand/application/use-cases/delete-brand.use-case';
import { BrandResponseMapper } from '../mappers/brand-response.mapper';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import type { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Controller('brands')
export class BrandController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly getBrandUseCase: GetBrandUseCase,
    private readonly listBrandsUseCase: ListBrandsUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
  ) {}

  @Get()
  async listBrands(
    @Query() query: ISharedQuery,
    @Headers('Accept-Language') languageCode: string,
  ) {
    const brands = await this.listBrandsUseCase.execute(query, languageCode);
    return BrandResponseMapper.toPaginatedResponse(brands);
  }

  @Get(':id')
  async getBrand(
    @Param('id') id: number,
    @Headers('Accept-Language') languageCode: string,
  ) {
    const brand = await this.getBrandUseCase.execute(id, languageCode);
    return BrandResponseMapper.toResponse(brand);
  }

  @Post()
  async createBrand(@Body() data: CreateBrandDto, @Req() req: any) {
    const brand = await this.createBrandUseCase.execute(data, req.user.id);
    return BrandResponseMapper.toResponse(brand);
  }

  @Put(':id')
  async updateBrand(
    @Param('id') id: number,
    @Body() data: UpdateBrandDto,
    @Req() req: any,
  ) {
    const brand = await this.updateBrandUseCase.execute(id, data, req.user.id);
    return BrandResponseMapper.toResponse(brand);
  }

  @Delete(':id')
  async deleteBrand(@Param('id') id: number, @Req() req: any) {
    await this.deleteBrandUseCase.execute(id, req.user.id);
  }
}
