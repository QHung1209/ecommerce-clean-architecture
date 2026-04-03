import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { VariantOption } from 'src/product/domain/entities/variant-option.entity';
import { IVariantOptionRepository } from 'src/product/domain/interfaces/variant-option-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaVariantOptionMapper } from '../mappers/prisma-variant-option.mapper';

@Injectable()
export class PrismaVariantOptionRepository implements IVariantOptionRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService | Prisma.TransactionClient) {}
  async save(entity: VariantOption, id: number): Promise<VariantOption> {
    const client = this.prisma;
    const savedVariantOption = entity.hasId()
      ? await client.variantOption.update({
          where: {
            deletedAt: null,
            id: entity.getId(),
          },
          data: {
            value: entity.getValue(),
            variantId: entity.getVariantId(),
            updatedById: id,
          },
          include: {
            variant: true,
          },
        })
      : await client.variantOption.create({
          data: {
            value: entity.getValue(),
            variantId: entity.getVariantId(),
            createdById: id,
          },
          include: {
            variant: true,
          },
        });
    return PrismaVariantOptionMapper.toDomain(savedVariantOption);
  }
  async findMany(conditions: any): Promise<VariantOption[] | []> {
    const client = this.prisma;
    const variantOptions = await client.variantOption.findMany({
      where: conditions,
      include: {
        variant: true,
      },
    });
    return variantOptions.map((variantOption) =>
      PrismaVariantOptionMapper.toDomain(variantOption),
    );
  }
  async findAllVariantOptions(languageCode?: string): Promise<VariantOption[]> {
    throw new Error('Method not implemented.');
  }
  async findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<VariantOption | null> {
    throw new Error('Method not implemented.');
  }
  async detail(
    id: number,
    languageCode?: string,
  ): Promise<VariantOption | null> {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<VariantOption | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async deleteMany(ids: number[], deletedById: number): Promise<void> {
    const client = this.prisma;
    await client.variantOption.updateMany({
      where: {
        deletedAt: null,
        id: {
          in: ids,
        },
      },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    });
  }
  async findAll(): Promise<VariantOption[]> {
    throw new Error('Method not implemented.');
  }
  async count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
