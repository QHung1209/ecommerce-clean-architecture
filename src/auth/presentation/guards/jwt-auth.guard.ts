import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  JwtPayload,
  JwtService,
} from 'src/auth/infrastructure/jwt/jwt.service';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = this.jwtService.verifyAccessToken(token);
      request.user = payload; // Attach user payload to request
      this.validateUserPermission(payload, request);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async validateUserPermission(user, request) {
    const checkPermission = await this.prisma.role.findUniqueOrThrow({
      where: {
        id: user.roleId,
      },
      include: {
        permissions: {
          where: {
            method: request.method,
            path: request.url,
          },
        },
      },
    });

    if (!checkPermission.permissions.length) {
      throw new UnauthorizedException('User does not have permission');
    }
  }

  validate(payload: JwtPayload) {
    return payload; // passport sẽ gắn vào req.user
  }
}
