import CryptoES from "crypto-es";

const algorithm = "aes-256-cbc";
const Securitykey = "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9"; //crypto.randomBytes(32);
const initVector = "O7SzQkunl5HUBl3d"; //crypto.randomBytes(16);

export function encryiptData(Securitykey, initVector, message) {
  //console.log("before enc3: " + message);

  let encrypted = CryptoES.AES.encrypt(message, Securitykey, {
    iv: initVector,
  });

  encrypted = encrypted.toString();

  //console.log("encrypted:  " + encrypted);
  return encrypted;

  /* const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  console.log("Encrypted message: " + encryptedData); */
}

export function decryiptData(Securitykey, initVector, encryptedData) {
  let decrypted = CryptoES.AES.decrypt(encryptedData, Securitykey, {
    iv: initVector,
  });

  decrypted = decrypted.toString(CryptoES.enc.Utf8);
  //console.log("decrypted:  " + decrypted + "\n\n\n\n");
  return decrypted;

  /* 
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  console.log("Decrypted message: " + decryptedData);
  return decryptedData;
 */
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

/* 
export function canenc() {
  var mytexttoEncryption = "cani sikmisler";
  let encrypted = CryptoES.AES.encrypt(mytexttoEncryption, "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9", {
    iv: "O7SzQkunl5HUBl3d",
  });

  let decrypted = CryptoES.AES.decrypt(encrypted, "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9", {
    iv: "O7SzQkunl5HUBl3d",
  });
  encrypted = encrypted.toString();
  decrypted = decrypted.toString(CryptoES.enc.Utf8);

  console.log("encrypted:  ", encrypted);
  console.log("decrypted:  " + decrypted + "\n\n\n\n");
}

canenc(); */
