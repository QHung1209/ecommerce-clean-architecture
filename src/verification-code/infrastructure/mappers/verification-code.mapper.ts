import {
  Prisma,
  VerificationCode as PrismaVerificationCode,
} from '@prisma/client';
import {
  VerificationCode,
  VerificationCodeProps,
  VerificationCodeType,
} from '../../domain/entities/verification-code.entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';

export class VerificationCodeMapper {
  static toDomain(prismaData: PrismaVerificationCode): VerificationCode {
    return VerificationCode.create(
      {
        email: Email.create(prismaData.email),
        code: prismaData.code,
        type: prismaData.type as VerificationCodeType,
        expiresAt: prismaData.expiresAt,
      },
      prismaData.id,
    );
  }

  static toPersistence(
    verificationCodeProps: VerificationCodeProps,
    id?: number,
  ): Prisma.VerificationCodeUncheckedCreateInput {
    return {
      id,
      email: verificationCodeProps.email.getValue(),
      code: verificationCodeProps.code,
      type: verificationCodeProps.type,
      expiresAt: verificationCodeProps.expiresAt,
    };
  }
}
