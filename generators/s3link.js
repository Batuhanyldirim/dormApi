import dotenv from "dotenv";
import crypto from "crypto";
import { promisify } from "util";
import { s3 } from "../connections/s3bucket.js";

const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const bucketName = "dorm-img-dev";

export async function generateSecureLink() {
  const rawBytes = await randomBytes(16);
  const image_name = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: image_name,
    Expires: 60,
  };

  const secureLink = await s3.getSignedUrlPromise("putObject", params);

  return secureLink;
}
