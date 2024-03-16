import AppDataSource from "../../data-source";
import { Relationship } from "../../entities/relationship.entity";
import { User } from "../../entities/user.entity";
import { IBlockUserService } from "../../interface/user/blockUser.interface";



const blockUserService = async ({userId, blockId}: IBlockUserService):Promise<{message:string}> =>{
  const userRepository = AppDataSource.getRepository(User);
  const relationshipRepository = AppDataSource.getRepository(Relationship);

  const user = userRepository.findOne({where: {id: userId}});
  const userToBlock = userRepository.findOne({where: {id: blockId}});

  return {
    message: "user blocked"
  }
}

export default blockUserService;