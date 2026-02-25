import { Brand } from 'src/brand/domain/entities/brand.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

export class BrandResponseMapper {
  static toResponse(brand: Brand): any {
    return {
      id: brand.getId(),
      name: brand.getName(),
      description: brand.getDescription(),
      logo: brand.getLogo(),
    };
  }

  static toResponseList(brands: Brand[]): any {
    return brands.map((brand) => this.toResponse(brand));
  }

  static toPaginatedResponse(brands: PaginatedResult<Brand>): any {
    return {
      data: this.toResponseList(brands.data),
      meta: {
        total: brands.total,
        totalPages: brands.totalPages,
        currentPage: brands.currentPage,
      },
    };
  }
}
