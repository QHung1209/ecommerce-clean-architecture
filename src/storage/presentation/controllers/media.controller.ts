import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadMediaUseCase } from '../../application/use-cases/upload-media.use-case';
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media.use-case';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SkipPermission } from 'src/auth/infrastructure/decorators/skip-permission.decorator';
import { MediaResponseMapper } from '../mappers/media-response.mapper';

@Controller('media')
export class MediaController {
  constructor(
    @Inject(UploadMediaUseCase)
    private readonly uploadMediaUseCase: UploadMediaUseCase,
    @Inject(DeleteMediaUseCase)
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
  ) {}

  @Post()
  @SkipPermission()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string,
    @Req() req: any,
  ) {
    const result = await this.uploadMediaUseCase.execute(
      files,
      folder,
      req.user.id,
    );
    return MediaResponseMapper.toResponseList(result);
  }

  @Delete()
  @SkipPermission()
  async deleteFile(@Query('url') url: string, @Req() req: any) {
    await this.deleteMediaUseCase.execute(url, req.user.id);
    return { message: 'Media deleted successfully' };
  }
}
