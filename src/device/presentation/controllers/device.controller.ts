import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { DeleteAllDeviceUseCase } from 'src/device/application/use-cases/delete-all-device.use-case';
import { DeleteDeviceUseCase } from 'src/device/application/use-cases/delete-device.use-case';
import { ListDevicesUseCase } from 'src/device/application/use-cases/list-devices.use-case';
import { LogoutAllUseCase } from 'src/device/application/use-cases/logout-all.use-case';
import { LogoutDeviceUseCase } from 'src/device/application/use-cases/logout-device.use-case';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { DeviceResponseMapper } from '../mappers/device-response.mapper';
import { SkipPermission } from 'src/auth/infrastructure/decorators/skip-permission.decorator';

@Controller('devices')
@SkipPermission()
export class DeviceController {
  constructor(
    private readonly listDevicesUseCase: ListDevicesUseCase,
    private readonly logoutDeviceUseCase: LogoutDeviceUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
  ) {}

  @Get()
  async listDevices(@Req() req: any, @Query() query: SharedQueryDto) {
    const devices = await this.listDevicesUseCase.execute(query, req.user.id);
    return DeviceResponseMapper.toPaginatedResponse(devices);
  }

  @Post(':deviceId/logout')
  async logoutDevice(@Param('deviceId') deviceId: number) {
    return await this.logoutDeviceUseCase.execute(deviceId);
  }

  @Post('logout-all')
  async logoutAll(@Req() req: any) {
    return await this.logoutAllUseCase.execute(req.user.id);
  }
}
