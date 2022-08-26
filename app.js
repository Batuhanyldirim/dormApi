/* 
Test change
*/

import express from "express";
import bp from "body-parser";
import mysql from "mysql2";
import userInfo from "os";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import cors from "cors";
import crypto from "crypto";

import { generateSecureLink } from "./connection/generation/s3link.js";
import { sessionTokenGenerator } from "./connection/generation/sessionToken.js";
import { swipeList } from "./logic/swipeList.js";
import { sendVerMail } from "./senders/verMail.js";
import { setDate } from "./connection/generation/endDateSet.js";
import { checkDislikeDate } from "./connection/generation/endDateSet.js";
import { updateGenderPreference } from "./connection/generation/updateGenderPref.js";
import { updateBoth } from "./connection/generation/updateGenderPref.js";
import { addUser } from "./connection/generation/updateGenderPref.js";
import { deleteUser } from "./connection/generation/updateGenderPref.js";
import { choseList } from "./logic/choseList.js";
import { encryiptData } from "./connection/generation/encrypt.js";
import { decryiptData } from "./connection/generation/encrypt.js";
import { encPipeline } from "./connection/generation/encrypt.js";
import { decPipeline } from "./connection/generation/encrypt.js";
import { con } from "./connection/generation/dbConnection.js";
import { sendNotification } from "./senders/notification.js";
import { likeNotification } from "./senders/notification.js";
import { appLists } from "./lists.js";
import { cacheStats } from "./lists.js";
import { statCache } from "./statInfo.js";

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

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/* 
const con = mysql.createConnection({
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
});

 */

function deleteS3Image(imgKey) {
  const region = "eu-central-1";
  const bucketName = "dorm-img-dev";
  const accessKeyId = process.env.AWS_ACCES_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });

  var params = { Bucket: bucketName, Key: imgKey };
  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // error
  });
}

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

con.query("USE main;");

function sendMatchInfo(userId1, userId, matchId, mod, message_status) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  var now = date.toISOString().slice(0, 16);
  var params = {
    Item: {
      userChatFirstUserId: {
        S: `${userId1}`, // Number value.
      },
      userChatSecondUserId: {
        S: `${userId}`, // Number value.
      },
      id: {
        S: `${matchId}`, // Number value.
      },
      mod: {
        S: `${mod}`, // Number value.
      },
      status: {
        S: `${message_status}`, // Number value.
      },
      updatedAt: {
        S: `${now}`, // Number value.
      },
      createdAt: {
        S: `${now}`, // Number value.
      },
      unreadMsg: {
        S: `0`, // Number value.
      },
      lastMsgSender: {
        S: ``, // Number value.
      },
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: tableName,
  };
  dynamoDB.putItem(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}

//SWIPE LIST CASHING//////////////////////////////////////////////////////////////////////////////////////////////////////
//let swipeResult = await swipeList(con, "-1");
//console.log("Result: " + JSON.stringify(swipeResult));
//console.log("Result length: " + Object.keys(swipeResult).length);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var genderPreference = {
  women: new Set(),
  men: new Set(),
  non_binary: new Set(),
  hetero: new Set(),
  homo: new Set(),
  bisexual: new Set(),
  pansexual: new Set(),
  asexual: new Set(),
};

var expectationList = {
  takilmak: new Set(),
  kisaSureli: new Set(),
  uzunSureli: new Set(),
  yeniArkadas: new Set(),
  etkinlikBuddy: new Set(),
  bilmiyorum: new Set(),
};

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

//Securephoto link
app.post("/SecurePhotoLink", cors(corsOptions), async (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    let decBody = decPipeline(req.body.message, secKeys);
    try {
      var token = req.headers["access-token"];
      var userId = decBody.userId;
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        try {
          if (result.length != 0 && result[0].UserId == userId) {
            let url = await generateSecureLink();
            url = encPipeline({ url }, secKeys);
            res.send(url);
          } else {
            res.status(410);
            res.send("Unauthorized Session");
          }
        } catch (err) {
          console.log(err);
          res.status(400);
          res.send("error");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400);
      res.send("error");
    }
  });
});

//Securephoto link
/* app.get("/SecurePhotoLink2dev", cors(corsOptions), async (req, res) => {
    const url = await generateSecureLink();
    res.send({ url });
  }); */

//ADD EVENT
app.post("/AddEvent", cors(corsOptions), (req, res) => {
  //console.log("This is req");
  //console.log(req.body.Location);
  const Location = req.body.Location;
  const desc = req.body.Description;
  const Date = req.body.Date;
  const StartTime = req.body.StartTime;
  const Category = req.body.Category;
  const Organizator = req.body.Organizator;
  const BuyLink = req.body.BuyLink;
  const Culture = req.body.Culture;
  const Konser = req.body.Konser;
  const Film = req.body.Film;
  const Kacmaz = req.body.Kacmaz;
  const Kampus = req.body.Kampus;
  const Gece = req.body.Gece;

  var sql = `INSERT INTO Events (Location, Description, Date, StartTime, Category, Organizator, BuyLink, Culture, Konser, Film, Kacmaz, Kampus, LinkClickCount, Gece, click, detailClick) 
        VALUES ('${Location}','${desc}','${Date}','${StartTime}','${Category}','${Organizator}','${BuyLink}','${Culture}','${Konser}','${Film}','${Kacmaz}','${Kampus}', 0, '${Gece}', 0, 0);`;
  con.query(sql, function (err, result) {
    try {
      var sql2 = `SELECT EventId FROM Events WHERE Location='${Location}' AND Description='${desc}' AND Date='${Date}' AND StartTime='${StartTime}' AND Category='${Category}' AND Organizator='${Organizator}';`;
      con.query(sql2, function (err, result2) {
        try {
          res.send(result2[0]);
        } catch (err) {
          res.send(err);
        }
      });
    } catch (err) {
      res.send(err);
    }
  });
});

//LOAD EVENT PHOTO LINK
app.post("/AddEventPhotoLink", cors(corsOptions), (req, res) => {
  var eventId = req.body.eventId;
  for (var i = 0; i < req.body.photos.length; i++) {
    var sql = `REPLACE INTO PhotosEvent (Photo_Order, PhotoLink, EventId) VALUES (${req.body.photos[i].Photo_Order} , '${req.body.photos[i].PhotoLink}', ${eventId});`;
    con.query(sql, function (err, result) {
      try {
      } catch (err) {
        res.send(err);
      }
    });
  }
  res.send({
    Message: "Update is successfull",
  });
});

//REGISTER
app.post("/register", async (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    let decBody = decPipeline(req.body.message, secKeys);

    const mail = decBody.mail;
    var UserVerCode = decBody.verification;

    var sql = `SELECT * FROM Verification WHERE VerMail = '${mail}';`;

    con.query(sql, function (err, result) {
      try {
        if (result[0] == undefined) {
          res.status(400);
          res.send({ Verification: -1 });
        } else if (result[0]["VerCode"] == UserVerCode) {
          var sql = `DELETE FROM Verification WHERE VerMail = '${mail}';`;
          con.query(sql, async function (err, result) {
            try {
              const name = decBody.name;
              const surName = decBody.surName;
              const city = decBody.city;
              const bDay = decBody.bDay;
              const school = decBody.school;
              const password = decBody.password;

              const blockCampus = false;
              const onlyCampus = false;
              const invisible = false;
              const AccountValidation = 0;
              const likeCount = 20;
              const superLikeCount = 5;
              const onBoardingComplete = 0;
              const matchMode = 1;
              const reportDegree = 0;
              const SwipeRefreshTime = await setDate();
              const frozen = 0;

              var sql = `SELECT * FROM User WHERE Mail = '${mail}';`;

              con.query(sql, function (err, result) {
                try {
                  if (result == "") {
                    var date = new Date();
                    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                    var now = date.toISOString().slice(0, -5);
                    var sql = `INSERT INTO User (Mail, Name, Surname, City, Birth_date, School, Password, BlockCampus, OnlyCampus, 
                        Invisible, AccountValidation, CreatedDate, LikeCount, SuperLikeCount, onBoardingComplete, matchMode, SwipeRefreshTime, reportDegree, frozen) 
                        VALUES ('${mail}','${name}','${surName}','${city}','${bDay}', '${school}', '${password}', '${blockCampus}', 
                        '${onlyCampus}', '${invisible}', '${AccountValidation}', '${now}', ${likeCount}, ${superLikeCount}, ${onBoardingComplete}, 
                        '${matchMode}', '${SwipeRefreshTime}', '${reportDegree}', '${frozen}');`;
                    con.query(sql, function (err, result) {
                      try {
                      } catch (err) {
                        res.status(400);
                        res.send(err);
                      }
                    });
                    var sql = `SELECT * FROM User WHERE Mail = '${mail}';`;
                    var CreatedId;
                    con.query(sql, async function (err, result) {
                      try {
                        var userData = JSON.parse(JSON.stringify(result).slice(1, -1));
                        CreatedId = userData.UserId;

                        var sesToken = await sessionTokenGenerator();

                        var sql = `REPLACE INTO sesToken (sesToken, UserId, Date) VALUES ('${sesToken}','${userData.UserId}', '${now}');`;
                        con.query(sql, function (err, result) {
                          try {
                          } catch (err) {
                            res.send(err);
                          }
                        });
                        var myres = {
                          userId: `${userData.UserId}`,
                          sesToken: sesToken,
                        };

                        myres = encPipeline(myres, secKeys);

                        res.send(myres);
                      } catch (err) {
                        res.status(400);
                        res.send(err);
                      }
                    });
                  } else {
                    //console.log("This user is already exist");

                    res.status(400);
                    res.send("This mail is already exist");
                  }
                } catch (err) {
                  res.status(400);
                  res.send(err);
                }
              });
            } catch (err) {
              res.status(400);
              res.send(err);
            }
          });

          //DELETE FROM `table_name` [WHERE condition];
        } else {
          res.status(400);
          res.send({ Verification: -1 });
        }
      } catch (err) {
        res.status(400);
        res.send(err);
      }
    });
  });
});

//PASSWORD REGISTER
app.post("/PasswordRegister", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;

    try {
      let decBody = decPipeline(req.body.message, secKeys);
      const mail = decBody.mail;
      const password = decBody.password;
      var UserVerCode = decBody.verification;
      var sql = `SELECT * FROM Verification WHERE VerMail = '${mail}';`;

      con.query(sql, function (err, result) {
        try {
          //console.log("verCode: " + result[0]["VerCode"]);
          //console.log("UserVerCode: " + UserVerCode);
          if (result[0] == undefined) {
            res.status(400);
            res.send({ Verification: -1 });
          } else if (result[0]["attempt"] > 0 && result[0]["VerCode"] == UserVerCode) {
            var sql = `DELETE FROM Verification WHERE VerMail = '${mail}';`;
            con.query(sql, function (err, result) {
              try {
                var sql = `UPDATE User SET Password ='${password}' WHERE Mail =  '${mail}';`;
                con.query(sql, function (err, result) {
                  try {
                    res.send("Şifre Değiştirildi");
                  } catch (err) {
                    res.send(err);
                  }
                });
              } catch (err) {
                res.send(err);
              }
            });
          } else if (result[0]["attempt"] == 0) {
            var sql = `DELETE FROM Verification WHERE VerMail = '${Mail}';`;
            con.query(sql, function (err, result) {
              try {
              } catch (err) {
                res.send(err);
              }
            });
            res.send({ Verification: 1 });
          } else {
            var sql = `UPDATE Verification SET attempt = '${
              result[0]["attempt"] - 1
            }' WHERE VerMail = '${mail}';`;
            con.query(sql, function (err, result) {
              try {
              } catch (err) {
                res.status(400);
                res.send("Error");
              }
            });
            res.status(400);
            res.send({ Verification: -1 });
          }
        } catch (err) {
          res.status(400);
          res.send(err);
        }
      });
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });
});

//AFTER REGISTER
app.post("/AfterRegister", async (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;

    try {
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var userId = decBody.userId;
        if (result.length != 0 && result[0].UserId == userId) {
          const gender = decBody.gender;
          const expectation = decBody.expectation;
          const InterestedSex = decBody.interestedSex;
          const SexualOrientation = decBody.sexualOrientation;
          const SOVisibility = decBody.SOVisibility;
          const GenderVisibility = decBody.genderVisibility;
          const onBoardingComplete = 1;
          const AccountValidation = 1;
          const matchMode = decBody.matchMode;

          addUser(
            genderPreference,
            userId,
            gender,
            SexualOrientation,
            expectationList,
            expectation
          );

          var sql = `UPDATE User SET Gender ='${gender}', Expectation ='${expectation}', InterestedSex ='${InterestedSex}', 
    SexualOrientation ='${SexualOrientation}', SOVisibility ='${SOVisibility}', GenderVisibility ='${GenderVisibility}', 
    onBoardingComplete = ${onBoardingComplete}, matchMode = ${matchMode}, AccountValidation = ${AccountValidation} WHERE UserId = ${userId};`;
          con.query(sql, async function (err, result) {
            try {
              //swipeResult = await swipeList(con, "-1");
            } catch (err) {
              res.send(err);
            }
          });
          res.send("AfterReg");
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });
});

//LOGIN
app.post("/Login", async (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      console.log("this is deviceId: ", deviceId);
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);

      const password = decBody.password;
      const mail = decBody.mail;
      var myres = {
        authentication: "false",
        UserId: "-1",
      };
      var sql = `SELECT * FROM User WHERE Mail = '${mail}';`;
      con.query(sql, function (err, result) {
        try {
          var date = new Date();
          date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
          var now = date.toISOString().slice(0, 16);

          if (result.length == 0) {
            res.status(400);
            res.send("Böyle bir kullanıcı yok");
          } else if (result.length != 0) {
            //var userData = JSON.parse(JSON.stringify(result).slice(1, -1));
            var userData = JSON.parse(JSON.stringify(result).slice(1, -1));

            if (password == userData.Password) {
              if (userData.frozen == 1) {
                var sql = `UPDATE User SET AccountValidation = 1, frozen = 0 WHERE UserId = ${userData.UserId}`;
                con.query(sql, function (err, result) {});
              }
              var sql = `SELECT * FROM Photos WHERE UserId = ${userData.UserId};`;
              con.query(sql, function (err, result2) {
                try {
                  var sql = `SELECT InterestName FROM Interested WHERE UserId = ${userData.UserId};`;
                  con.query(sql, async function (err, result3) {
                    try {
                      var myInterests = [];
                      var myPhotos = [];
                      if (result3.length != 0) myInterests = result3;
                      if (result2.length != 0) myPhotos = result2;

                      var sesToken = await sessionTokenGenerator();
                      var date = await new Date();

                      var sql = `REPLACE INTO sesToken (sesToken, UserId, Date) VALUES ('${sesToken}','${userData.UserId}', '${now}');`;
                      con.query(sql, function (err, result) {
                        try {
                        } catch (err) {
                          res.send("Error about sesToken");
                        }
                      });
                      myres = {
                        authentication: "true",
                        userId: userData.UserId,
                        Birth_date: userData.Birth_date,
                        Name: `${userData.Name}`,
                        Gender: `${userData.Gender}`,
                        Surname: `${userData.Surname}`,
                        School: `${userData.School}`,
                        BlockCampus: `${userData.BlockCampus}`,
                        OnlyCampus: `${userData.OnlyCampus}`,
                        Invisible: `${userData.Invisible}`,
                        PremiumEndDate: `${userData.PremiumEndDate}`,
                        LikeCount: `${userData.LikeCount}`,
                        SuperLikeCount: `${userData.SuperLikeCount}`,
                        SwipeRefreshTime: `${userData.SwipeRefreshTime}`,
                        Expectation: `${userData.Expectation}`,
                        InterestedSex: `${userData.InterestedSex}`,
                        SexualOrientationame: `${userData.SexualOrientation}`,
                        SOVisibility: `${userData.SOVisibility}`,
                        Major: `${userData.Major}`,
                        Din: `${userData.Din}`,
                        Burc: `${userData.Burc}`,
                        Beslenme: `${userData.Beslenme}`,
                        Alkol: `${userData.Alkol}`,
                        Sigara: `${userData.Sigara}`,
                        About: `${userData.About}`,
                        Name: `${userData.Name}`,
                        Photo: myPhotos,
                        interest: myInterests,
                        sesToken: sesToken,
                        onBoardingComplete: userData.onBoardingComplete,
                        matchMode: userData.matchMode,
                        applists: appLists,
                      };
                      myres = encPipeline(myres, secKeys);
                      res.send(myres);
                    } catch (err) {
                      res.send("Error while selecting interest");
                    }
                  });
                } catch (err) {
                  res.send("Error While selecting photos");
                }
              });
            } else {
              res.status(400);
              myres = "Parola Yanlış";
              res.send(myres);
            }
          }
        } catch (err) {
          res.send("Error while checking user");
          console.log(err);
        }
      });
    } catch (err) {
      res.status(420);
      res.send(
        "Giriş yapmak için uygulamayı güncellemeniz gerekmektedir. Yeni güncelleme kritik güvenlik önlemleri sağladığı için uygulamayı kullanmaya devam edebilmek için lütefn uygulamayı güncelleyin. "
      );
    }
  });
});

//Like/Dislike
app.post("/LikeDislike", async (req, res) => {
  let deviceId = req.body.dormId;
  var token = req.headers["access-token"];
  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const userLiked = decBody.userSwiped;
        if (result.length != 0 && result[0].UserId == userLiked) {
          const isLike = decBody.isLike;
          const otherUser = decBody.otherUser;
          const matchMode = decBody.matchMode;
          var eventId = decBody?.eventId;
          var date = new Date();
          date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
          var now = date.toISOString().slice(0, 16);

          var sql8 = `SELECT LikeCount, SuperLikeCount, SwipeRefreshTime FROM User WHERE Userid = ${userLiked};`;

          con.query(sql8, async function (err, result4) {
            try {
              var likeCount = JSON.parse(JSON.stringify(result4).slice(1, -1)).LikeCount;
              var superLikeCount = JSON.parse(JSON.stringify(result4).slice(1, -1)).SuperLikeCount;
              var SwipeRefreshTime = JSON.parse(
                JSON.stringify(result4).slice(1, -1)
              ).SwipeRefreshTime;

              //console.log("time in database: " + SwipeRefreshTime);
              //console.log("current time: " + now);

              if (
                (isLike == 0 && likeCount > 1) ||
                (isLike == 1 && superLikeCount > 0) ||
                isLike == 2 ||
                (likeCount < 2 && now > SwipeRefreshTime)
              ) {
                var sql = "UPDATE stats SET swipeCount = swipeCount + 1";

                con.query(sql, function (err, result) {
                  try {
                  } catch (err) {
                    //console.log(err);
                  }
                });

                var sql2 = `SELECT * FROM LikeOther WHERE otherUser = '${decBody.userSwiped}' AND userLiked = ${decBody.otherUser}`;
                con.query(sql2, function (err, result2) {
                  try {
                    if (result2.length == 0 || isLike == 2) {
                      const actionDate = now;
                      if (isLike == 0 && likeCount > 1) {
                        likeCount = likeCount - 1;
                        var sql = `INSERT INTO LikeOther (userLiked, otherUser, LikeDate, Superlike, likeMode, eventId) VALUES ('${userLiked}','${otherUser}','${actionDate}','0', '${matchMode}', ${eventId});`;
                        var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','0');`;
                        var sql9 = `UPDATE User SET LikeCount = ${likeCount} WHERE UserId = ${userLiked};`;
                        likeNotification(userLiked, otherUser, eventId, token);
                      } else if (isLike == 0 && likeCount < 2) {
                        likeCount = 19;
                        var sql = `INSERT INTO LikeOther (userLiked, otherUser, LikeDate, Superlike, likeMode, eventId) VALUES ('${userLiked}','${otherUser}','${actionDate}','0', '${matchMode}', ${eventId});`;
                        var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','0');`;
                        var sql9 = `UPDATE User SET LikeCount = ${19} WHERE UserId = ${userLiked}`;
                        likeNotification(userLiked, otherUser, eventId, token);
                      } else if (isLike == 1) {
                        superLikeCount = superLikeCount - 1;
                        var sql = `INSERT INTO LikeOther (userLiked, otherUser, LikeDate, Superlike, likeMode, eventId) VALUES ('${userLiked}','${otherUser}','${actionDate}','1', '${matchMode}', ${eventId});`;
                        var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','1');`;
                        var sql9 = `UPDATE User SET SuperLikeCount = ${superLikeCount} WHERE UserId = ${userLiked};`;
                        likeNotification(userLiked, otherUser, eventId, token);
                      } else if (isLike == 2) {
                        var sql = `INSERT INTO DislikeOther (PersonDisliked, otherPerson, DislikeDate) VALUES ('${userLiked}','${otherUser}','${actionDate}');`;
                        var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','0');`;
                      }
                      con.query(sql, function (err, result) {
                        try {
                          con.query(sql7, function (err, result) {
                            try {
                              if (isLike != 2) {
                                con.query(sql9, async function (err, result) {
                                  try {
                                    if (likeCount > 6 && likeCount < 10) {
                                      var sql10 = `UPDATE User SET SwipeRefreshTime = '${await setDate()}' WHERE UserId = ${userLiked};`;
                                      con.query(sql10, function (err, result) {
                                        try {
                                          //console.log("swipe time refreshed in like");
                                        } catch (err) {
                                          //console.log("Error while setting Swipe Refresh");
                                          res.status(411);
                                          res.send("Error while setting Swipe Refresh");
                                        }
                                      });
                                    }
                                    res.send({
                                      message: "Like Processed",
                                      LikeCount: likeCount,
                                      SuperLikeCount: superLikeCount,
                                    });
                                  } catch (err) {
                                    res.status(401);
                                    console.log(err);
                                    res.send("Error while decreasing like");
                                  }
                                });
                              }
                              if (isLike == 2) res.send("Dislike processed");
                            } catch (err) {
                              console.log(err);
                              res.status(402);
                              res.send("Error while adding acted other");
                            }
                          });
                        } catch (err) {
                          res.status(403);
                          console.log(err);
                        }
                      });
                    } else if (isLike != 2) {
                      var userData = JSON.parse(JSON.stringify(result2).slice(1, -1));
                      var superLike = "0";
                      if (eventId == 0) {
                        eventId = userData.eventId;
                      }
                      if (isLike == 0 && likeCount > 1) {
                        likeCount = likeCount - 1;
                        var sql9 = `UPDATE User SET LikeCount = ${likeCount} WHERE UserId = ${userLiked};`;
                      } else if (isLike == 0 && likeCount < 2) {
                        likeCount = 19;
                        var sql9 = `UPDATE User SET LikeCount = ${likeCount} WHERE UserId = ${userLiked};`;
                      } else if (isLike == 1 && likeCount > 0) {
                        superLikeCount = superLikeCount - 1;
                        var sql9 = `UPDATE User SET SuperLikeCount = ${superLikeCount} WHERE UserId = ${userLiked};`;
                      }

                      var sql3 = `INSERT INTO MatchR (MId1, MId2 , SuperMatch, matchMode, eventId, date) VALUES ('${decBody.userSwiped}', '${decBody.otherUser}', ${superLike}, ${matchMode}, ${eventId}, '${now}')`;
                      var sql6 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${decBody.userSwiped}','${decBody.otherUser}','${now}','${superLike}');`;
                      con.query(sql3, function (err, result) {
                        try {
                          var matchResult = syncQuery(
                            con,
                            `SELECT MatchId FROM MatchR WHERE MId1 = ${decBody.userSwiped} AND MId2 = ${decBody.otherUser}`
                          );

                          sendNotification(
                            matchResult.MatchId,
                            decBody.userSwiped,
                            decBody.otherUser,
                            matchMode,
                            token
                          );

                          con.query(sql6, function (err, result) {
                            try {
                              con.query(sql9, async function (err, result) {
                                try {
                                  if (likeCount > 6 && likeCount < 10) {
                                    var sql10 = `UPDATE User SET SwipeRefreshTime = '${await setDate()}' WHERE UserId = ${userLiked};`;
                                    con.query(sql10, function (err, result) {
                                      try {
                                        //console.log("swipe time refreshed in match");
                                      } catch (err) {
                                        res.status(411);
                                        res.send("Error while setting Swipe Refresh");
                                      }
                                    });
                                  }
                                } catch (err) {
                                  console.log(err);
                                  res.status(401);
                                  res.send("Error while decreasing like");
                                }
                              });
                            } catch (err) {
                              res.status(402);
                              res.send("Error while adding acted other");
                            }
                          });
                        } catch (err) {
                          res.status(405);
                          res.send("Error while adding matchR table");
                        }
                      });
                      var sql5 = `SELECT MatchId, matchMode FROM MatchR WHERE MId1 = ${decBody.userSwiped} AND MId2 = ${decBody.otherUser}`;
                      con.query(sql5, function (err, result) {
                        try {
                          //console.log("This is matchMode: " + result[0].matchMode);
                          //console.log(result[0].MatchId);
                          sendMatchInfo(
                            decBody.userSwiped,
                            decBody.otherUser,
                            result[0].MatchId,
                            result[0].matchMode,
                            "Active"
                          );
                        } catch (err) {
                          res.status(406);
                          console.log(err);
                        }
                      });

                      var sql4 = `DELETE FROM LikeOther WHERE userLiked = ${decBody.otherUser} AND otherUser = ${decBody.userSwiped};`;
                      con.query(sql4, function (err, result) {
                        try {
                        } catch (err) {
                          res.status(406);
                          res.send(err);
                        }
                      });
                      res.send({
                        message: "Match",
                        LikeCount: likeCount,
                        SuperLikeCount: superLikeCount,
                        eventId: eventId,
                      });
                    }
                  } catch (err) {
                    res.status(407);
                    console.log(err);
                    res.send("Error occured in somewhere");
                  }
                });
              } else {
                var sql = `SELECT SwipeRefreshTime FROM User WHERE Userid = ${userLiked};`;
                con.query(sql, async function (err, result4) {
                  var SwipeRefreshTime = JSON.parse(
                    JSON.stringify(result4).slice(1, -1)
                  ).SwipeRefreshTime;
                  res.status(408);
                  res.send(SwipeRefreshTime);
                });
              }
            } catch (err) {
              res.status(409);
              res.send("Error while getting like count");
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

//CHANGE VISIBILITY
app.post("/ChangeVisibility", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    let decBody = decPipeline(req.body.message, secKeys);

    try {
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const invisible = decBody.invisible;
          var sql = `UPDATE User SET Invisible ='${invisible}' WHERE UserId = ${UserId};`;

          con.query(sql, async function (err, result) {
            try {
              //swipeResult = await swipeList(con, "-1");
            } catch (err) {
              res.send(err);
            }
          });
          res.send();
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

//Block Campus
app.post("/BlockCampus", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    let decBody = decPipeline(req.body.message, secKeys);
    try {
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;

        if (result.length != 0 && result[0].UserId == UserId) {
          const BlockCampus = decBody.BlockCampus;

          var sql = `UPDATE User SET BlockCampus ='${BlockCampus}' WHERE UserId = ${UserId};`;

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

//Only Campus
app.post("/OnlyCampus", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const OnlyCampus = decBody.OnlyCampus;

          var sql = `UPDATE User SET OnlyCampus ='${OnlyCampus}' WHERE UserId = ${UserId};`;

          con.query(sql, async function (err, result) {
            try {
              //swipeResult = await swipeList(con, "-1");
            } catch (err) {
              res.send(err);
            }
          });
          res.send();
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

//FrozeAccount
app.post("/FreezeAccount", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var sql = `UPDATE User SET AccountValidation = 0, frozen = 1 WHERE UserId = ${UserId}`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[frozenUser] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
              res.send("Account Frozen");
            } catch (err) {
              res.status(400);
              res.send("Error");
            }
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });
});

//LINK CLICK COUNTER
app.post("/EventLinkClick", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const eventId = decBody.eventId;
          var sql = `UPDATE Events SET LinkClickCount = LinkClickCount + 1 WHERE EventId = ${eventId};`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[dailyLinkClick] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
            } catch (err) {
              res.send(err);
            }
          });
          res.send();
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });
});

//EVENT CLICK COUNTER
app.post("/EventClick", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const eventId = decBody.eventId;
          var sql = `UPDATE Events SET click = click + 1 WHERE EventId = ${eventId};`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[dailyEventClick] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
            } catch (err) {
              res.send(err);
            }
          });
          res.send();
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

//DETAIL EVENT CLICK COUNTER
app.post("/detailEventClick", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        try {
          const UserId = decBody.userId;
          if (result.length != 0 && result[0].UserId == UserId) {
            const eventId = decBody.eventId;
            var sql = `UPDATE Events SET detailClick = detailClick + 1 WHERE EventId = ${eventId};`;
            con.query(sql, function (err, result) {
              try {
                cacheStats[dailyDetailClick] += 1;
                cacheStats[cacheSize] += 1;
                if (cacheStats[cacheSize] > 50) {
                  statCache();
                }
              } catch (err) {
                res.send(err);
              }
            });
            res.send();
          } else {
            res.status(410);
            res.send("Unauthorized Session");
          }
        } catch (err) {
          console.log(err);
          res.send("error");
        }
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

//GET EVENT LIST
app.post("/EventList", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var UserId = decBody.userId;
        //console.log("userId: " + UserId);
        //console.log("token: " + token);
        if (result.length != 0 && result[0].UserId == UserId) {
          //var sql2 = `SELECT School FROM User WHERE UserId = '${UserId}'`;
          //con.query(sql2, function (err, result4) {
          //try {
          var campus = decBody.camups; //result4[0].School;
          //console.log("This is campus: " + campus);
          var sql = `SELECT * FROM Events WHERE (Kampus = '0' OR Kampus = '${campus}') AND visible = 1 ORDER BY Date ASC;`;
          con.query(sql, function (err, result) {
            try {
              var sql = `SELECT EventId FROM LikeEvent WHERE UserId = ${UserId} AND UserId NOT IN (SELECT otherUser FROM ActedOther WHERE userActed = '${UserId}')`;
              con.query(sql, function (err, result3) {
                try {
                  var event_list = [];
                  for (let i = 0; i < result.length; i++) {
                    event_list.push(result[i]);
                    event_list[i]["isLiked"] = "0";
                    event_list[i]["photos"] = [];
                    if (event_list[i].Kampus != "0") {
                      event_list[i].Kampus = "1";
                    }
                    for (let j = 0; j < result3.length; j++) {
                      if (event_list[i].EventId == result3[j].EventId) {
                        event_list[i]["isLiked"] = "1";
                      }
                    }
                  }
                  var sql = `SELECT * FROM PhotosEvent;`;
                  con.query(sql, function (err, result2) {
                    try {
                      for (let i = 0; i < result2.length; i++) {
                        for (let j = 0; j < result.length; j++) {
                          if (result2[i].EventId == event_list[j].EventId) {
                            event_list[j]["photos"].push(result2[i].PhotoLink);
                          }
                        }
                      }
                      //console.log(event_list);
                      event_list = encPipeline(event_list, secKeys);
                      res.send(event_list);
                      return;
                    } catch (err) {
                      console.log(err);
                      res.send("err");
                    }
                  });
                } catch (err) {
                  console.log(err);
                  res.send("err");
                }
              });
            } catch (err) {
              console.log(err);
              res.send("err");
            }
          });
          //} catch (err) {}
          //});
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400);
      res.send("error");
    }
  });
});

//SWIPE LIST
app.post("/SwipeList", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var userId = decBody.userId;
        if (result.length != 0 && result[0].UserId == userId) {
          var minAge = decBody.age[0];
          var maxAge = decBody.age[1];
          var cinsiyet = decBody.cinsiyet;

          var alcohol = decBody.alkol;
          var cigar = decBody.sigara;
          var food = decBody.yemek;
          var sql2 = `SELECT Gender, InterestedSex, matchMode, Expectation, BlockCampus, OnlyCampus, School, Invisible FROM User WHERE UserId =${userId};`;
          con.query(sql2, function (err, result2) {
            try {
              var userData = JSON.parse(JSON.stringify(result2).slice(1, -1));
              //console.log("This is result\n\n" + (await swipeList(con, "-1")));
              if (userData.Invisible) {
                res.status(411);
                res.send("Invisible");
              } else {
                /* 
                console.log("userId: " + userId);
                console.log("minAge: " + minAge);
                console.log("maxAge: " + maxAge);
                console.log("cinsiyet: " + cinsiyet);
                console.log("alcohol: " + alcohol);
                console.log("cigar: " + cigar);
                console.log("userId: " + userId);
                          */
                swipeList(
                  con,
                  userId,
                  minAge,
                  maxAge,
                  cinsiyet,
                  alcohol,
                  cigar,
                  res,
                  userData.Gender,
                  userData.InterestedSex,
                  genderPreference,
                  expectationList,
                  userData.matchMode,
                  userData.Expectation,
                  userData.BlockCampus,
                  userData.OnlyCampus,
                  userData.School,
                  secKeys
                );
              }
            } catch (err) {
              console.log(err);
              res.send("error");
            }
            //res.send(Object.values(swipeResult));
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400);
      res.send(400);
    }
  });
});

//GET ONE USER INFO
app.post("/profileinfo", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const userId = decBody.userId;
        const otherId = decBody.otherId;
        if (result.length != 0 && result[0].UserId == userId) {
          var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM User WHERE UserId = ${otherId};`;
          con.query(sql, function (err, result) {
            try {
              var user = result[0];
              user["photos"] = [];
              user["interest"] = [];

              var sql2 = `SELECT * FROM Photos WHERE UserId = ${otherId};`;
              con.query(sql2, function (err, result2) {
                try {
                  for (let i = 0; i < result2.length; i++) {
                    user["photos"].push(result2[i]);
                  }

                  var sql3 = `SELECT * FROM Interested WHERE UserId = ${otherId};`;
                  con.query(sql3, function (err, result3) {
                    try {
                      for (let i = 0; i < result3.length; i++) {
                        user["interest"].push(result3[i]);
                      }
                      var profInfo = encPipeline(result[0], secKeys);
                      res.send(profInfo);
                    } catch (err) {
                      console.log(err);
                      res.send("There is a problem");
                    }
                  });
                } catch (err) {
                  console.log(err);
                  res.send("There is a problem");
                }
              });
            } catch (err) {
              console.log(err);

              res.status(401);
              res.send("There is a problem");
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

//SEND VERIFICATION
app.post("/SendVerification", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      const Mail = decBody.mail;
      const isNewUser = decBody.isNewUser;
      var verCode = between(1000, 10000);
      var date = new Date();
      date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
      var now = date.toISOString().slice(0, -2);

      var sql = `SELECT UserId FROM User WHERE Mail = '${Mail}';`;

      con.query(sql, function (err, result) {
        try {
          if ((result == "" && isNewUser) || (result != "" && !isNewUser)) {
            var sql = `DELETE FROM Verification WHERE VerMail = '${Mail}'`;
            con.query(sql, function (err, result) {
              try {
                var sql = `INSERT INTO Verification (VerMail, VerCode, attempt, date) VALUES ('${Mail}' , '${verCode}', 3, '${now}');`;
                con.query(sql, function (err, result) {
                  try {
                    sendVerMail(Mail, verCode, isNewUser);
                    res.send({ Message: "Code has sent" });
                  } catch (err) {
                    res.send(err);
                  }
                });
              } catch (err) {
                res.send(err);
              }
            });
          } else if (result == "" && !isNewUser) {
            res.send("");
          } else {
            res.status(400);
            res.send(
              "Bu mail adresi ile zaten bir hesap bulunmakta. Şifrenizi hatırlamıyorsanız yeni şifre isteyebilirsiniz."
            );
          }
        } catch (err) {}
      });
    } catch (err) {
      res.send("error");
    }
  });
});

//CHECK VERIFICATION
app.post("/CheckVerification", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, secKeys);
      const Mail = decBody.mail;
      var UserVerCode = decBody.verCode;

      var sql = `SELECT * FROM Verification WHERE VerMail = '${Mail}';`;
      con.query(sql, function (err, result) {
        try {
          if (result[0] == undefined) {
            res.status(400);
            res.send({ Verification: -1 });
          } else if (result[0]["attempt"] > 0 && result[0]["VerCode"] == UserVerCode) {
            res.send({ Verification: 1 });
            /*
          var sql = `DELETE FROM Verification WHERE VerMail = '${Mail}';`;
          con.query(sql, function (err, result) {
            try {
            } catch (err) {
              res.send(err);
            }
          });
          res.send({ Verification: 1 });
          //DELETE FROM `table_name` [WHERE condition];
          */
          } else if (result[0]["attempt"] == 0) {
            var sql = `DELETE FROM Verification WHERE VerMail = '${Mail}';`;
            con.query(sql, function (err, result) {
              try {
              } catch (err) {
                res.send(err);
              }
            });
            res.send({ Verification: 1 });
          } else {
            var sql = `UPDATE Verification SET attempt = '${
              result[0]["attempt"] - 1
            }' WHERE VerMail = '${Mail}';`;
            con.query(sql, function (err, result) {
              try {
              } catch (err) {
                res.send("Error");
              }
            });
            res.status(400);
            res.send({ Verification: -1 });
          }
        } catch (err) {
          res.send(err);
        }
      });
    } catch (err) {
      res.send("Error");
    }
  });
});

//MATCH MODE
app.post("/matchmode", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;

      con.query(sql, async function (err, result) {
        const userId = decBody.userId;
        if (result.length != 0 && result[0].UserId == userId) {
          const matchMode = decBody.matchMode;

          var sql = `UPDATE User SET matchMode = '${matchMode}' WHERE UserId = '${userId}';`;
          con.query(sql, function (err, result) {
            try {
              res.send("Update is successfull");
            } catch (err) {
              res.send("matchMode Error");
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

//IDENTITY UPDATE
app.post("/IdentityUpdate", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const Name = decBody.Name;
          const Surname = decBody.Surname;
          const Gender = decBody.Gender;
          const Major = decBody.Major;
          const Din = decBody.Din;
          const Burc = decBody.Burc;
          const Beslenme = decBody.Beslenme;
          const Alkol = decBody.Alkol;
          const Sigara = decBody.Sigara;
          const About = decBody.About;

          var sql = `UPDATE User SET Name = '${Name}',Surname = '${Surname}',Gender = '${Gender}',Major = '${Major}', Din = '${Din}', Burc = '${Burc}', Beslenme = '${Beslenme}', Alkol = '${Alkol}', Sigara = '${Sigara}', About = '${About}'  WHERE UserId = ${UserId};`;
          con.query(sql, async function (err, result) {
            try {
              //swipeResult = await swipeList(con, "-1");
              res.send({
                Message: "Update is successfull",
              });
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
      res.send(400);
      res.send("error");
    }
  });
});

//INTERESTS
app.post("/Interests", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var sql = `DELETE FROM Interested WHERE UserId = ${UserId}`;

          con.query(sql, function (err, result) {
            try {
            } catch (err) {
              res.send(err);
            }
          });

          for (var i = 0; i < decBody.hobbies.length; i++) {
            var sql = `INSERT INTO Interested (InterestName, UserId) VALUES ('${decBody.hobbies[i]}' , ${UserId});`;

            con.query(sql, function (err, result) {
              try {
              } catch (err) {
                res.send(err);
              }
            });
          }
          //swipeResult = await swipeList(con, "-1");
          res.send({
            Message: "Update is successfull",
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

//LOAD USER PHOTO LINK
app.post("/AddPhotoLink", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    let secKeys = result;
    let decBody = decPipeline(req.body.message, secKeys);
    try {
      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var UserId = decBody.userId;

        if (result.length != 0 && result[0].UserId == UserId) {
          var sql2 = `DELETE FROM Photos WHERE UserId=${UserId};`;
          con.query(sql2, function (err, result) {
            try {
            } catch (err) {
              res.send(err);
            }
          });
          for (var i = 0; i < decBody.photos.length; i++) {
            var photoName = decBody.photos[i].PhotoLink.split("/");
            photoName = photoName[photoName.length - 1];
            var photoLink = "https://d13pzveje1c51z.cloudfront.net/" + photoName;
            //console.log("this is front link: ", photoLink);
            var sql = `REPLACE INTO Photos (Photo_Order, PhotoLink, UserId) VALUES (${decBody.photos[i].Photo_Order} , '${photoLink}', ${UserId});`;
            con.query(sql, function (err, result) {
              try {
                //console.log("Photo link: " + decBody.photos[i].PhotoLink);
              } catch (err) {
                //res.send(err);
              }
            });
          }
          //swipeResult = await swipeList(con, "-1");
          res.send({
            Message: "Update is successfull",
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

//DELETE PHOTO FROM S3
app.post("/deleteS3Photo", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);
      deleteS3Image(decBody.photoName);
      res.send({
        Message: "Item deleted",
      });
    } catch (err) {
      res.status(400);
      res.send("error");
    }
  });
});

//DeleteAccount
app.post("/deleteAccount", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var date = new Date();
          date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
          var now = date.toISOString().slice(0, -5);
          var sql = `SELECT * FROM User WHERE UserId = ${UserId};`;

          con.query(sql, function (err, result) {
            try {
              var userData = JSON.parse(JSON.stringify(result).slice(1, -1));
              const mail = userData.Mail;
              const name = userData.Name;
              const surName = userData.Surname;
              const city = userData.City;
              const bDay = userData.Birth_date;
              const school = userData.School;
              const gender = userData.Gender;
              const password = userData.Password;
              const blockCampus = userData.BlockCampus;
              const onlyCampus = userData.OnlyCampus;
              const invisible = userData.Invisible;
              const premiumDate = userData.PremiumEndDate;
              const LikeCount = userData.LikeCount;
              const SuperLikeCount = userData.SuperLikeCount;
              const SwipeRefreshTime = userData.SwipeRefreshTime;
              const Expectation = userData.Expectation;
              const InterestedSex = userData.InterestedSex;
              const SexualOrientation = userData.SexualOrientation;
              const SOVisibility = userData.SOVisibility;
              const GenderVisibility = userData.GenderVisibility;
              const AccountValidation = userData.AccountValidation;
              const Alkol = userData.Alkol;
              const Sigara = userData.Sigara;
              const Burc = userData.Burc;
              const Beslenme = userData.Beslenme;
              const Major = userData.Major;
              const Din = userData.Din;
              const About = userData.About;
              const CreatedDate = userData.CreatedDate;
              const matchMode = userData.matchMode;
              const reportDegree = userData.reportDegree;

              var sql2 = `INSERT INTO DeletedUser (Mail, Name, Surname, City, Birth_date, School, Gender, Password, BlockCampus, OnlyCampus, 
                            Invisible, PremiumEndDate, LikeCount, SuperLikeCount, SwipeRefreshTime, UserId, Expectation, InterestedSex, SexualOrientation, 
                            SOVisibility, GenderVisibility, AccountValidation, Alkol, Sigara, Burc, Beslenme, Major, Din, About, CreatedDate, matchMode, 
                            reportDegree, deletionDate) VALUES ('${mail}','${name}','${surName}',
                            '${city}','${bDay}','${school}','${gender}','${password}','${blockCampus}','${onlyCampus}','${invisible}','${premiumDate}',
                            '${LikeCount}','${SuperLikeCount}','${SwipeRefreshTime}','${UserId}','${Expectation}','${InterestedSex}','${SexualOrientation}',
                            '${SOVisibility}', '${GenderVisibility}', '${AccountValidation}', '${Alkol}', '${Sigara}', '${Burc}', '${Beslenme}',
                            '${Major}', '${Din}', '${About}', '${CreatedDate}', '${matchMode}', '${reportDegree}', '${now}');`;

              con.query(sql2, function (err, result) {
                try {
                  deleteUser(
                    genderPreference,
                    UserId,
                    gender,
                    SexualOrientation,
                    expectationList,
                    Expectation
                  );
                } catch (err) {
                  console.log(err);
                  res.send(err);
                }
              });

              var sql3 = "DELETE FROM User WHERE UserId = " + UserId + ";";
              con.query(sql3, async function (err, result) {
                try {
                } catch (err) {
                  res.send(err);
                }
              });
            } catch (err) {
              res.send(err);
            }
          });

          res.send();
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

//LIKE EVENT
app.post("/likeEvent", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const eventId = decBody.eventId;
          const likeMode = decBody.likeMode;
          var sql = `INSERT INTO LikeEvent (EventId, UserId, likeMode) VALUES ('${eventId}', '${UserId}', ${likeMode});`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[dailyEventLike] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
              res.send({
                Message: "Event liked",
              });
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

//DISLIKE EVENT
app.post("/dislikeEvent", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          const eventId = decBody.eventId;
          var sql = `DELETE FROM LikeEvent WHERE EventId = ${eventId} AND UserId = ${UserId};`;
          con.query(sql, function (err, result) {
            try {
              res.send({
                Message: "Event Disliked",
              });
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

//EVENT PARTICIPANTS
app.post("/eventParticipants", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let secKeys = result;
      let decBody = decPipeline(req.body.message, result);
      var token = req.headers["access-token"];

      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var eventId = decBody.eventId;
        var userId = decBody.userId;
        if (result.length != 0 && result[0].UserId == userId) {
          var sql3 = `SELECT Gender, InterestedSex, matchMode, Expectation, BlockCampus, OnlyCampus, School, Invisible FROM User WHERE UserId =${userId};`;
          con.query(sql3, function (err, result3) {
            try {
              var userData = JSON.parse(JSON.stringify(result3).slice(1, -1));
              if (userData.Invisible) {
                res.status(411);
                res.send("Invisible");
              } else {
                var sql2 = `SELECT likeMode FROM LikeEvent WHERE UserId = ${userId} AND EventId = ${eventId};`;
                con.query(sql2, function (err, result2) {
                  try {
                    //console.log("this is result:", result2);
                    if (result2[0].likeMode == 0) {
                      var swipeId = choseList(
                        genderPreference,
                        userData.Gender,
                        userData.InterestedSex,
                        expectationList,
                        userData.Expectation
                      );

                      var resultSwipeId = "(";
                      for (let i = 0; i < swipeId.length; i++) {
                        resultSwipeId += JSON.stringify(swipeId[i]);
                        resultSwipeId += ",";
                      }

                      if (resultSwipeId.length == 1) resultSwipeId += "0";
                      if (resultSwipeId.length > 2)
                        resultSwipeId = resultSwipeId.substring(0, resultSwipeId.length - 1);
                      resultSwipeId += ")";

                      var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM 
            User WHERE UserId IN (SELECT UserId FROM LikeEvent WHERE EventId = ${eventId} AND Invisible = 0 AND likeMode = 0) 
            AND UserId IN ${resultSwipeId} AND UserId != ${userId} AND ((BlockCampus = 1 AND UserID != '1118' AND UserID != '1206' AND UserId != '1411' AND School != '${userData.School}') OR 
            (OnlyCampus = 1 AND School = '${userData.School}') OR (OnlyCampus = 0 AND BlockCampus = 0)) AND UserId NOT IN 
            (SELECT otherUser FROM ActedOther WHERE userActed = '${userId}') AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${userId}'); `;
                    } else if (result2[0].likeMode == 1) {
                      var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM 
            User WHERE UserId IN (SELECT UserId FROM LikeEvent WHERE EventId = ${eventId} AND UserID != '1118' AND UserID != '1206' AND UserId != '1411' AND Invisible = 0 AND likeMode = 1) 
            AND UserId != ${userId} AND ((BlockCampus = 1 AND School != '${userData.School}') OR (OnlyCampus = 1 AND School = '${userData.School}') 
            OR (OnlyCampus = 0 AND BlockCampus = 0)) AND UserId NOT IN (SELECT otherUser FROM ActedOther WHERE userActed = '${userId}') AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${userId}'); `;
                    }

                    con.query(sql, function (err, result) {
                      try {
                        var swipe_list = [];
                        for (let i = 0; i < result.length; i++) {
                          let user = result[i];
                          user["photos"] = [];
                          user["interest"] = [];
                          swipe_list.push(user);
                        }
                        var sql = `SELECT * FROM Photos;`;
                        con.query(sql, function (err, result2) {
                          try {
                            //console.log(result2);

                            for (let i = 0; i < result2.length; i++) {
                              for (let j = 0; j < swipe_list.length; j++) {
                                if (swipe_list[j].UserId == result2[i].UserId) {
                                  swipe_list[j]["photos"].push(result2[i]);
                                }
                              }
                            }

                            var sql = `SELECT * FROM Interested;`;
                            con.query(sql, function (err, result3) {
                              try {
                                for (let i = 0; i < result3.length; i++) {
                                  for (let j = 0; j < swipe_list.length; j++) {
                                    if (swipe_list[j].UserId == result3[i].UserId) {
                                      swipe_list[j]["interest"].push(result3[i]);
                                    }
                                  }
                                }
                                //console.log(swipe_list);
                                swipe_list = swipe_list.sort(() => Math.random() - 0.5);
                                swipe_list = encPipeline(swipe_list, secKeys);
                                res.send(swipe_list);
                              } catch (err) {
                                console.log(err);
                                res.send(err);
                              }
                            });
                          } catch (err) {
                            console.log(err);
                            res.send(err);
                          }
                        });
                      } catch (err) {
                        console.log(err);
                        res.send(err);
                      }
                    });
                  } catch (err) {
                    console.log(err);
                    res.send("Etkinliğin beğeni modunu seçerken hata oluştu");
                  }
                });
              }
            } catch (err) {
              console.log(err);
              res.send("Kullanıcı bilgilerini almaya çalışırken hata oluştu");
            }
          });
        } else {
          res.status(410);
          res.send("Unauthorized Session");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400);
      res.send("Error");
    }
  });
});

//GET LIKED EVENTS
app.post("/getLikedEvent", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        const UserId = decBody.userId;
        if (result.length != 0 && result[0].UserId == UserId) {
          var sql = `SELECT * FROM Events WHERE EventId IN (SELECT EventId FROM LikeEvent WHERE UserId  = ${UserId});;`;
          con.query(sql, function (err, result) {
            try {
              var event_list = [];
              for (let i = 0; i < result.length; i++) {
                event_list.push(result[i]);
                event_list[i]["photos"] = [];
              }
              var sql = `SELECT * FROM PhotosEvent;`;
              con.query(sql, function (err, result2) {
                try {
                  for (let i = 0; i < result2.length; i++) {
                    for (let j = 0; j < result.length; j++) {
                      if (result2[i].EventId == event_list[j].EventId) {
                        event_list[j]["photos"].push(result2[i].PhotoLink);
                      }
                    }
                  }
                  event_list = encPipeline(event_list, secKeys);
                  res.send(event_list);
                } catch {
                  res.send(err);
                }
              });
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

//GETTING PROFILE PICTURE LINK
app.post("/getProfilePic", (req, res) => {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      let decBody = decPipeline(req.body.message, result);

      var token = req.headers["access-token"];
      var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
      con.query(sql, async function (err, result) {
        var UserId = decBody.userId;
        var otherId = decBody.otherId;

        if (result.length != 0 && result[0].UserId == UserId) {
          var sql = `SELECT PhotoLink FROM Photos WHERE UserId = '${otherId}' AND Photo_Order = '1'`;
          con.query(sql, function (err, result) {
            try {
              res.send(result);
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

//UNMATCH
app.post("/unmatch", (req, res) => {
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
          var unmatchId = decBody.unmatchId;
          var sql = `DELETE FROM MatchR WHERE MatchId = ${unmatchId}`;
          con.query(sql, function (err, result) {
            try {
              cacheStats[dailyUnmatch] += 1;
              cacheStats[cacheSize] += 1;
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
              if (cacheStats[cacheSize] > 50) {
                statCache();
              }
              res.send("Unmatched");
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

//GET MATCH LIST
app.post("/matchList", async (req, res) => {
  var token = req.headers["access-token"];
  var userId = req.body.userId;
  var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
  con.query(sql, async function (err, result) {
    try {
      if (result != undefined && result.length != 0 && result[0].UserId == userId) {
        var sql2 = `SELECT * FROM MatchR WHERE MId1 = ${userId} OR MId2 = ${userId}`;
        con.query(sql2, function (err, result2) {
          try {
            res.send(result2);
          } catch (err) {
            res.status(400);
            res.send("Error");
          }
        });
        res.send(ticket);
      } else {
        res.status(410);
        res.send("Unautharized Session");
      }
    } catch (err) {}
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
      var deviceId = "0LgSVO6fZohbAMhcc1Dkvl2QDVrJZl2g";
      var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
      con.query(sql, function (err, result) {
        var req = {
          mail: "ybatuhan@sabanciuniv.edu",
          password: "af7174e78915f897081d1ac27446de4332214d4802cfa470166235af317164a0",
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
