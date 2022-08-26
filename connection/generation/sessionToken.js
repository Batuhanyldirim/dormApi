import crypto from "crypto";
import util from "util";

const randomBytesAsync = util.promisify(crypto.randomBytes);

export async function sessionTokenGenerator() {
  let bytes = await randomBytesAsync(24);
  return bytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
}
