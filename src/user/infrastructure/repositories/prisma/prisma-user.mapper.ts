import { Prisma, User as PrismaUser } from '@prisma/client';
import { User, UserProps } from 'src/user/domain/entities/user.entity';

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): User {
    const { id, avatar, totpSecret, ...rest } = user;
    return new User(id, {
      ...rest,
      avatar: avatar ?? undefined,
      totpSecret: totpSecret ?? undefined,
    } as UserProps);
  }

  static toPersistence(
    id: number,
    user: UserProps,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id,
      ...user,
    };
  }
}
