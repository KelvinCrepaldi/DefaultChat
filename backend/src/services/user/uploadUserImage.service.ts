import s3 from "../../aws-config";
import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";


const uploadUserImageService = async ({file, userId }: any) =>{

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({where: {id: userId}})

  if(!user){
    throw new AppError(404, "user not found")
  }

  const params = {
    Bucket: "fuinha",
    Key: file.originalname,
    Body: file.buffer
  }

  const data = await s3.upload(params).promise();

  user.image = data.Location;
  userRepository.save(user)
  
  return data
}

export default uploadUserImageService;