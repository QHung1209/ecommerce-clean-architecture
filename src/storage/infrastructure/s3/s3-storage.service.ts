import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from 'src/storage/domain/interfaces/storage-service.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('S3_REGION'),
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    const projectId = this.configService.getOrThrow<string>('S3_PROJECT_ID');
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );
    const url = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${key}`;
    return {
      url,
      key,
      fileName: file.originalname,
      size: file.size,
      type: file.mimetype,
    };
  }
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<
    {
      url: string;
      key: string;
      fileName: string;
      size: number;
      type: string;
    }[]
  > {
    return await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );
  }
  async deleteFile(fileKey: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET_NAME'),
        Key: fileKey,
      }),
    );
  }
}
