/* 
Route branch modification
*/

import express from "express";
import bp from "body-parser";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import cors from "cors";

import { generateSecureLink } from "./connection/generation/s3link.js";

import { setDate } from "./connection/generation/endDateSet.js";
//import { checkDislikeDate } from "./connection/generation/endDateSet.js";
//import { updateGenderPreference } from "./connection/generation/updateGenderPref.js";
import { updateBoth } from "./connection/generation/updateGenderPref.js";

//import { encryiptData } from "./connection/generation/encrypt.js";
import { decryiptData } from "./connection/generation/encrypt.js";
import { encPipeline } from "./connection/generation/encrypt.js";
import { decPipeline } from "./connection/generation/encrypt.js";
import { con } from "./connection/generation/dbConnection.js";

import { appLists } from "./lists.js";
import { cacheStats } from "./lists.js";
import { genderPreference } from "./lists.js";
import { expectationList } from "./lists.js";
import { statCache } from "./statInfo.js";

import { accountRouter } from "./routes/account.js";
import { statisticsRouter } from "./routes/statistics.js";
import { profileRouter } from "./routes/profile.js";
import { userActionRouter } from "./routes/userAction.js";
import { listsRouter } from "./routes/lists.js";

dotenv.config();

const region = "eu-central-1";
const accessKeyId = process.env.AWS_ACCES_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const tableName = "UserChat-iw2d4boh4zbyfooyvaawszlrue-dev";

//AWS.config.update({ region: "eu-central-1" });

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: "eu-central-1",
});

var dynamoDB = new AWS.DynamoDB({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//const algorithm = "aes-256-cbc";

// generate 16 bytes of random data

const initVector = "O7SzQkunl5HUBl3d"; //crypto.randomBytes(16);
const Securitykey = "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9"; //crypto.randomBytes(32);

/* let myjson = {
  userId: "1",
  campus: "Sabancı Üniversitesi",
};

//console.log("This is stringified version: " + JSON.stringify(myjson));

// protected data
const message = JSON.stringify(myjson);
//"U2FsdGVkX1/I1nvjWwq1DNtjHsB+CG68e3+0KTZR4kBFmJen6qRERtiD8VlNoY7wspB/z/+0AXjrqEXnuQafDgds8jeWGOi2mhiHsw/77SDMVEp+wWwyzmF6JWbLsnEPf4CrApfdTuf7xnrss+vEjmkzJel0IA+x1oqpoZNmGyqT5e6C3wajVCd4U9lAJTZAuid4steLBJNh0xQoOOxwJy7IixxsbgqZZB5x1vrN6QiERPpOlDUlta4eli8MEtlNZOBIvXtM+LaNMEHeJj9KifeNCn95xAESQRNE/fMxk7HsnChL1u95+zmtbKXxRUsBChKjCXyp5qEY3AjQ2uWGYVXDF8UTkM5L2T8Cbe9vkry0EpkWyMgpFTWHm1FK00sWuQbdgAPiN8kN3taDcjNHDZP8/BeOm0+VyOjI5PwLxnFe4VfaccrlJregDlf85Ssr1I5tOXvd4SeBlHzfkW8kI241esg//NDCHFraI+CiRB1VfPZ8vjokaZVvQLEc2RkFw2wdGHFQYQ7q3G9czTrII4keSXbtnukSIqINtOek3m8KxIgZJYdSIEW1MuMcXmUEMI+bFo2+VCfEc11lo1Juluqdk8kpQRg1DQlMRzf+s9A1At98zSsRxPCEgrI1tio5rA/Gk3R39vpiZJHU8HuXkszUu/m+dweRjJcn5I8qGPgwEXgNFZWSP2kf7Vj7KSz4Y5E7Md8G6aXctAzvkJvZ+CdOfC27mczFQI+7nZI0U+R0MUYddXBcEv2fVX/oGDF/OZfDJ4lNl/CuI8w2ahl9iYJuhy1StpXMmMTMKPQ9v28+WxURFlBuok8q63ZqlTxdD0P3lveDKTN31Ddq7H/Ig87YPO/x3oCIqX60HURg8t+SBUleGaOzui3iDpAFoh+KEtd8bKLRH9mIhUYtbVwFlzQGcRocDoiJe6VD5aWEvIyVm9d5mIe8kzQJFDgUK7spdmEjtnjeF1H0NQr9rN3cxV9rWfOS3AUIF3R2rGbKMtOGJ36osQ0OhNikL12A/ixkMaYypEzUuC+yv6SDHSi9BVT82jm2hh9SuZ8o0Xkl4bi8FXiquPdLn2J+srefWtFdrxq+0LSxQM2O2qph9JQ6mI8nK+Gq2t47EKdmX8LIh7g="; //"mesaj bu"; //JSON.stringify(myjson); //`this is the message`;

// secret key generate 32 bytes of random data

//console.log("initVector: " + initVector);
//console.log("Securitykey: " + Securitykey);

let encryptedData = encryiptData(Securitykey, initVector, message);
let receivedMessage = decryiptData(Securitykey, initVector, encryptedData);
//let receivedMessage = decryiptData(Securitykey, initVector, message);

console.log("Decrypted Data: " + receivedMessage); */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

app.use("/account", accountRouter);
app.use("/statistics", statisticsRouter);
app.use("/profile", profileRouter);
app.use("/userAction", userActionRouter);
app.use("/lists", listsRouter);

/* 
const con = mysql.createConnection({
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
});

 */

function syncQuery(con, sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}

//con.connect(async function (err) {
//if (err) throw err;

//SWIPE LIST CASHING//////////////////////////////////////////////////////////////////////////////////////////////////////
//let swipeResult = await swipeList(con, "-1");
//console.log("Result: " + JSON.stringify(swipeResult));
//console.log("Result length: " + Object.keys(swipeResult).length);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//updateGenderPreference(con, genderPreference);
updateBoth(con, genderPreference, expectationList);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CHECK UPDATEGENDERPREFERENCE LIST

/* app.get("/checklist", cors(corsOptions), async (req, res) => {
    var token = req.headers["access-token"];
    var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
    con.query(sql, async function (err, result) {
      if (result.length != 0) {
        console.log(expectationList);
        res.send("Printed as log");
      } else {
        res.status(410);
            res.send("Unauthorized Session");
      }
    });
  }); */

// REPORT
app.post("/report", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var sikayetci = UserId;
          var sikayetEdilen = decBody.sikayetEdilen;
          var sikayetKodu = decBody.sikayetKodu;
          var aciklama = decBody.aciklama;
          var sql = `INSERT INTO rapor (sikayetEden, sikayetEdilen, sikayetKodu, Aciklama) VALUES ('${sikayetci}', '${sikayetEdilen}', '${sikayetKodu}', '${aciklama}');`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[dailyNewReport] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
              res.send("Rapor gönderildi");
            } catch (err) {
              res.send(err);
            }
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

// EVENT REPORT
app.post("/eventreport", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var sikayetci = decBody.sikayetEden;
        if (result.length != 0 && result[0].UserId == sikayetci) {
          var sikayetEdilen = decBody.eventId;
          var sikayetKodu = decBody.sikayetKodu;
          var aciklama = decBody.aciklama;

          var sql = `INSERT INTO eventRapor (sikayetEden, sikayetEdilen, sikayetKodu, Aciklama) VALUES ('${sikayetci}', '${sikayetEdilen}', '${sikayetKodu}', '${aciklama}');`;
          con.query(sql, function (err, result) {
            try {
              res.send("Rapor gönderildi");
            } catch (err) {
              res.send(err);
            }
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

//GET TOKEN
app.post("/getToken", (req, res) => {
  let deviceId = req.body.dormId;
  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    try {
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var sql = `SELECT * FROM notification WHERE userId = ${UserId};`;
          con.query(sql, async function (err, result) {
            try {
              var myKey = result[0].notifKey;
              var encResponse = encPipeline({ myKey }, secKeys);
              res.send(encResponse);
            } catch (err) {
              console.log(err);
              res.send(err);
            }
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

//REGISTER TOKEN
app.post("/registerToken", (req, res) => {
  let deviceId = req.body.dormId;
  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    try {
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];

      var sql = `SELECT User.UserId, User.Name FROM sesToken, User WHERE sesToken = '${token}' AND sesToken.UserId = User.UserId`;

      con.query(sql, async function (err, result) {
        const userId = decBody.userId;
        if (result.length != 0 && result[0].UserId == userId) {
          const notifKey = decBody.token;

          var sql = `REPLACE INTO notification (userId, notifKey) VALUES ('${userId}','${notifKey}');`;
          con.query(sql, async function (err, result) {
            try {
              //swipeResult = await swipeList(con, "-1");
            } catch (err) {
              res.send(err);
            }
          });
          res.send("Okay");
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

//APP VERSION
app.post("/appversion", (req, res) => {
  const appVersion = "1.2.7";
  //console.log("\n\n\nApp version is: " + appVersion);

  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  var now = date.toISOString().slice(0, 16);

  let deviceId = req.body.dormId;

  let decBody = JSON.parse(decryiptData(Securitykey, initVector, req.body.message)); //decPipeline(req.body.message);

  var sql = `REPLACE INTO deviceId (deviceId, securityKey, initVector, date) VALUES ('${decBody.deviceId}','${decBody.newSecuritykey}', '${decBody.newInitVector}', '${now}');`;

  con.query(sql, async function (err, result) {
    try {
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });

  res.send({
    appVersion: appVersion,
    univList: appLists["univList"],
    genderList: appLists["genderList"],
  });
});

/*  app.post("/maildenem", (req, res) => {
    var Mail = req.body.mail;
    var verCode = req.body.verCode;
    var isNewUser = req.body.isNewUser;
    sendVerMail(Mail, verCode, isNewUser);
    console.log("Mail has sent");
    res.send("mail has sent");
  }); */

/*  app.get("/notiftest", (req, res) => {
    sendNotification(712, 1, 31);
    res.send("Okay");
  }); */

app.get("", cors(corsOptions), (req, res) => {
  var welcome_message = `dorm'a hoş geldin. Bir dolu macera ve etkinlik seni bekliyor.

        Eğer bu sayfadaysan uygulamanın arka plandaki güvenliğini kontrol etmek istiyor olabilirsin.
        Güvenliğe ve kişisel bilgilerin korunmasına önem veren bir ekip olarak size kolaylıklar ve keyifli günler diliyoruz.
                                                                                                        - dorm Ekibi
            `;

  res.send(welcome_message);
});

if (process.env.RUN_STATE == "DEV") {
  //createEnc
  app.get("/createEnc", (req, res) => {
    if (process.env.DEV_TOKEN == req.headers["dev-token"]) {
      var deviceId = "05j5HnTH1QWc1xQRCrucKY56o81kKj5i";
      var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
      con.query(sql, function (err, result) {
        var req = {
          userId: 1,
        };

        var encreq = encPipeline(req, result);

        var response = {
          dormId: `${deviceId}`,
          message: encreq,
        };

        res.send(response);
      });
    } else {
      res.send("Unauthorized attmept");
    }
  });
}

/* async function changeLink() {
    var sql = `SELECT * FROM Photos`;

    var result = await syncQuery(con, sql);
    //console.log(result);

    for (var i = 500; i < result.length; i++) {
      var photoName = result[i].PhotoLink.split("/");
      photoName = photoName[photoName.length - 1];

      var photoLink = "https://d13pzveje1c51z.cloudfront.net/" + photoName;
      //console.log("this is front link: ", photoLink);
      var sql = `REPLACE INTO Photos (Photo_Order, PhotoLink, UserId) VALUES (${result[i].Photo_Order} , '${photoLink}', ${result[i].UserId});`;

      var result2 = await syncQuery(con, sql);
      if (i % 10 == 0) console.log(i);
    }
    console.log("Photo links has changed");
  }

  //changeLink(); */

//con.end();
//});
