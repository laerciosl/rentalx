import { inject, injectable } from "tsyringe";

import { deleteFile } from "../../../../utils/files";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const folderAvatar = "./tmp/avatar";
    const user = await this.usersRepository.findById(userId);

    if (user.avatar) {
      await deleteFile(`${folderAvatar}/${user?.avatar}`);
    }

    user.avatar = avatarFile;

    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };