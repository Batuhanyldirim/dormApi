import express from "express";
import cors from "cors";

import { con } from "../connection/generation/dbConnection.js";
import { encPipeline } from "../connection/generation/encrypt.js";
import { decPipeline } from "../connection/generation/encrypt.js";
import { decryiptData } from "../connection/generation/encrypt.js";
import { cacheStats } from "../lists.js";
import { statCache } from "../statInfo.js";
import { appLists } from "../lists.js";

export const mainRouter = express.Router();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

const initVector = "O7SzQkunl5HUBl3d"; //crypto.randomBytes(16);
const Securitykey = "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9"; //crypto.randomBytes(32);

mainRouter.post("/trial", function (req, res, next) {
  console.log("this is message: ", req.body);
  console.log("main route is working");
  res.send("main route is working");
});

// REPORT
mainRouter.post("/report", (req, res) => {
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
mainRouter.post("/eventreport", (req, res) => {
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
mainRouter.post("/getToken", (req, res) => {
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
mainRouter.post("/registerToken", (req, res) => {
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
mainRouter.post("/appversion", (req, res) => {
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

mainRouter.get("", cors(corsOptions), (req, res) => {
  var welcome_message = `dorm'a hoş geldin. Bir dolu macera ve etkinlik seni bekliyor.
  
          Eğer bu sayfadaysan uygulamanın arka plandaki güvenliğini kontrol etmek istiyor olabilirsin.
          Güvenliğe ve kişisel bilgilerin korunmasına önem veren bir ekip olarak size kolaylıklar ve keyifli günler diliyoruz.
                                                                                                          - dorm Ekibi
              `;

  res.send(welcome_message);
});

if (process.env.RUN_STATE == "DEV") {
  //createEnc
  mainRouter.get("/createEnc", (req, res) => {
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
