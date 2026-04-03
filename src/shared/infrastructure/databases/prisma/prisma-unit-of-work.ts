import { Injectable, Inject } from '@nestjs/common';
import { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaProductRepository } from 'src/product/infrastructure/repositories/prisma-product.repository';
import { PrismaSkuRepository } from 'src/product/infrastructure/repositories/prisma-sku.repository';
import { PrismaVariantRepository } from 'src/product/infrastructure/repositories/prisma-variant.repository';
import { PrismaVariantOptionRepository } from 'src/product/infrastructure/repositories/prisma-variant-option.repository';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService | Prisma.TransactionClient,
  ) {}

  async runInTransaction<T>(
    work: (uow: IUnitOfWork) => Promise<T>,
  ): Promise<T> {
    if ('$transaction' in this.prisma) {
      return (this.prisma as PrismaService).$transaction((tx) => {
        const transactionalUow = new PrismaUnitOfWork(tx);
        return work(transactionalUow);
      });
    }
    return work(this);
  }

  getProductRepository() {
    return new PrismaProductRepository(this.prisma);
  }

  getSkuRepository() {
    return new PrismaSkuRepository(this.prisma);
  }

  getVariantRepository() {
    return new PrismaVariantRepository(this.prisma);
  }

  getVariantOptionRepository() {
    return new PrismaVariantOptionRepository(this.prisma);
  }
}
