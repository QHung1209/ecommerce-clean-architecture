import { Prisma, User as PrismaUser } from '@prisma/client';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';
import { Password } from 'src/shared/domain/value-objects/password.vo';

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): User {
    const { id, email, avatar, password, ...rest } = user;

    const userEntity = User.create(
      {
        ...rest,
        avatar: avatar || undefined,
        email: Email.create(email),
        password: password,
      },
      id,
    );

    return userEntity;
  }

  static toPersistence(userProps: UserProps, id?: number): Prisma.UserUncheckedCreateInput {
    return {
      id,
      email: userProps.email.getValue(),
      password: userProps.password,
      name: userProps.name,
      phoneNumber: userProps.phoneNumber,
      avatar: userProps.avatar,
      status: userProps.status,
      roleId: userProps.roleId,
      tokenVersion: userProps.tokenVersion,
    };
  }
}
