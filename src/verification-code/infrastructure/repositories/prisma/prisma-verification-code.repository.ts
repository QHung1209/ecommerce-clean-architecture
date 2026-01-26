import { Injectable } from '@nestjs/common';
import { IVerificationCodeRepository } from 'src/verification-code/domain/interfaces/verification-code.repository.interface';
import { VerificationCodeMapper } from '../../mappers/verification-code.mapper';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import {
  VerificationCode,
  VerificationCodeType,
} from 'src/verification-code/domain/entities/verification-code.entity';

@Injectable()
export class PrismaVerificationCodeRepository implements IVerificationCodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(verificationCode: VerificationCode): Promise<void> {
    const data = VerificationCodeMapper.toPersistence(
      verificationCode.getProps(),
      verificationCode.getId(),
    );

    const email = verificationCode.getEmail().getValue();

    const existing = await this.prismaService.verificationCode.findUnique({
      where: { email },
    });

    if (existing) {
      await this.prismaService.verificationCode.update({
        where: { email },
        data: { ...data },
      });
    } else {
      await this.prismaService.verificationCode.create({
        data,
      });
    }
  }

  async findByEmailAndType(
    email: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null> {
    const data = await this.prismaService.verificationCode.findFirst({
      where: {
        email: email,
        type: type,
      },
    });

    if (!data) return null;

    return VerificationCodeMapper.toDomain(data);
  }

  async delete(email: string, type: VerificationCodeType): Promise<void> {
    const data = await this.prismaService.verificationCode.findFirst({
      where: { email, type },
    });

    if (data) {
      await this.prismaService.verificationCode.delete({
        where: { id: data.id },
      });
    }
  }
}
