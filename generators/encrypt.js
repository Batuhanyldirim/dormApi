import CryptoES from "crypto-es";

const algorithm = "aes-256-cbc";
const Securitykey = "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9"; //crypto.randomBytes(32);
const initVector = "O7SzQkunl5HUBl3d"; //crypto.randomBytes(16);

export function encryiptData(Securitykey, initVector, message) {
  let encrypted = CryptoES.AES.encrypt(message, Securitykey, {
    iv: initVector,
  });

  encrypted = encrypted.toString();
  return encrypted;
}

export function decryiptData(Securitykey, initVector, encryptedData) {
  let decrypted = CryptoES.AES.decrypt(encryptedData, Securitykey, {
    iv: initVector,
  });

  decrypted = decrypted.toString(CryptoES.enc.Utf8);

  return decrypted;
}

export function encPipeline(resBody, result) {
  var userData = JSON.parse(JSON.stringify(result).slice(1, -1));

  var receivedMessage = encryiptData(
    userData.securityKey,
    userData.initVector,
    JSON.stringify(resBody)
  );

  return receivedMessage;
}

export function decPipeline(reqBody, secKeys) {
  try {
    var userData = JSON.parse(JSON.stringify(secKeys).slice(1, -1));

    let receivedMessage = decryiptData(userData.securityKey, userData.initVector, reqBody);

    //console.log(JSON.parse(receivedMessage));

    return JSON.parse(receivedMessage);
  } catch (err) {
    console.log("\n\nThis is secKeys: ", secKeys, "\n");
    console.log("This is error: ", err);
  }
}
