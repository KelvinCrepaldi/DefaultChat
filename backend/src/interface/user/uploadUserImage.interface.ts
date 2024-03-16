
export interface IFile{
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
export interface IUploadUserImageRequest {
  file: IFile | undefined,
  userId: string;
}