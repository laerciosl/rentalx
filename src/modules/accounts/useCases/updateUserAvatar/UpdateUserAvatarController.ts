import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const avatarFile = request.file!.filename;

    const updateUserAvataUseCase = container.resolve(UpdateUserAvatarUseCase);

    await updateUserAvataUseCase.execute({ userId: id, avatarFile });

    return response.status(204).send();
  }
}

export { UpdateUserAvatarController };
