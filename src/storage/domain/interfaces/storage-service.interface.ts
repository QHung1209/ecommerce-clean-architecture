export interface IStorageService {
  uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    url: string;
    key: string;
    fileName: string;
    size: number;
    type: string;
  }>;
  uploadFiles(
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
  >;
  deleteFile(fileKey: string): Promise<void>;
}
