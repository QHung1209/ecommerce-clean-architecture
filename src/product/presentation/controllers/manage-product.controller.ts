import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateProductUseCase } from 'src/product/application/use-cases/create-product.use-case';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductUseCase } from 'src/product/application/use-cases/update-product.use-case';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('manage-product/products')
export class ManageProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    await this.createProductUseCase.execute(createProductDto, req.user.id);
    return;
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    const data = await this.updateProductUseCase.execute(
      id,
      updateProductDto,
      req.user.id,
    );
    return data;
  }
}
