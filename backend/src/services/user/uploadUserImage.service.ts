import s3 from "../../aws-config";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { IUploadUserImageRequest } from "../../interface/user/uploadUserImage.interface";

const uploadUserImageService = async ({file, userId }: IUploadUserImageRequest) =>{
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({where: {id: userId}})

  if(!user){
    throw new AppError(404, "user not found")
  }

  if(!file){
    throw new AppError(404, "File not found.")
  }

  const params = {
    Bucket: "fuinha",
    Key: user.id + "_profile",
    Body: file.buffer
  }

  const data = await s3.upload(params).promise();

  user.image = data.Location;
  userRepository.save(user)
  
  return data
}

export default uploadUserImageService;