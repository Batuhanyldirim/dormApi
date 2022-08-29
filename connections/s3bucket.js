import AWS from "aws-sdk";

const region = "eu-central-1";
const accessKeyId = process.env.AWS_ACCES_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});
