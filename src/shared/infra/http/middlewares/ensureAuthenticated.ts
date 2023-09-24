import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  const userTokensRepository = new UsersTokensRepository();

  if (!authHeader) {
    throw new AppError("Token missing!", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: userId } = verify(
      token,
      process.env.SECRET_REFRESH_TOKEN!,
    ) as IPayload;

    const user = userTokensRepository.findUserByIdAndRefreshToken(
      userId,
      token,
    );

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    request.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError("Invalid token!", 401);
  }
}
