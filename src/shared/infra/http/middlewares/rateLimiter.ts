import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import * as redis from "redis";

import { AppError } from "@shared/errors/AppError";

const redisClient = redis.createClient({
  // legacyMode: true,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.connect();

const options = {
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 10, // 5 requests
  duration: 5, // per 5 second by IP
};

const limiter = new RateLimiterRedis(options);

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const ip =
      request.headers["x-forwarded-for"] || request.socket.remoteAddress;
    await limiter.consume(ip);
    next();
  } catch (err) {
    throw new AppError("Too Many Requests", 429);
  }
}
