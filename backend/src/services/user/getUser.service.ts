import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { IGetUser, IGetUserRequest } from "../../interface/user/getUser.interface";

const getUserService = async ({ id } : IGetUserRequest):Promise<IGetUser> =>{
  const userRepository = AppDataSource.getRepository(User)

  const user = await userRepository.findOne({where:{id: id}})

  if(!user){
    throw new AppError(404, 'User not found!')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  }
}

export default getUserService;