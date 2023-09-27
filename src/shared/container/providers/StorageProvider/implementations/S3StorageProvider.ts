import fs from "fs";
import { resolve } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies, import-helpers/order-imports
import mime from "mime";

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);

    const ContentType = mime.getType(originalName)!;

    const putCommand = new PutObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}`,
      Key: `${folder}/${file}`,
      ACL: "public-read",
      Body: fileContent,
      ContentType,
    });

    await this.client.send(putCommand);

    await fs.promises.unlink(originalName);

    return file;
  }
  async delete(file: string, folder: string): Promise<void> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: `${process.env.AWS_BUCKET}`,
      Key: `${folder}/${file}`,
    });

    try {
      await this.client.send(deleteCommand);
    } catch (err) {
      console.log(err);
    }
  }
}

export { S3StorageProvider };
