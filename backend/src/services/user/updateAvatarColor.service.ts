import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { AVATAR_COLORS } from "../../utils/avatarColors";

const updateAvatarColorService = async ({
  userId,
  color,
}: {
  userId: string;
  color: string;
}): Promise<{ id: string; name: string; email: string; image: string }> => {
  if (!(AVATAR_COLORS as readonly string[]).includes(color)) {
    throw new AppError(400, "Invalid avatar color");
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  user.image = color;
  await userRepository.save(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
};

export default updateAvatarColorService;
