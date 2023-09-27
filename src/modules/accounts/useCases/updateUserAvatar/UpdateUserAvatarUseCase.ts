import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
  userId: string;
  avatarFile: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private StorageProvider: IStorageProvider,
  ) {}

  async execute({ userId, avatarFile }: IRequest): Promise<void> {
    const folderAvatar = "avatar";
    const user = await this.usersRepository.findById(userId);

    if (user!.avatar) {
      await this.StorageProvider.delete(user!.avatar, folderAvatar);
    }

    await this.StorageProvider.save(avatarFile, folderAvatar);

    user!.avatar = avatarFile;

    await this.usersRepository.create(user!);
  }
}

export { UpdateUserAvatarUseCase };
