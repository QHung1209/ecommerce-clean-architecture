import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Ip,
  Headers,
} from '@nestjs/common';
import { LoginUseCase } from 'src/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from 'src/auth/application/use-cases/logout.use-case';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterUseCase } from 'src/auth/application/use-cases/register.use-case';
import { Public } from '../../infrastructure/decorators/public.decorator';
import { SkipPermission } from 'src/auth/infrastructure/decorators/skip-permission.decorator';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Ip() ipdec: string,
  ): Promise<AuthResponseDto> {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      ipdec;
    return await this.loginUseCase.execute(
      loginDto.email,
      loginDto.password,
      ip,
      req.headers['user-agent'],
    );
  }

  @Post('logout')
  @SkipPermission()
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() logoutDto: LogoutDto,
    @Headers('Authorization') accessToken: string,
  ): Promise<{ message: string }> {
    await this.logoutUseCase.execute(logoutDto.refreshToken, accessToken);
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.registerUseCase.execute(registerDto);
  }
}
