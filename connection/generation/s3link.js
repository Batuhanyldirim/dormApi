import aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = "eu-central-1";
const bucketName = "dorm-img-dev";
const accessKeyId = process.env.AWS_ACCES_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

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
