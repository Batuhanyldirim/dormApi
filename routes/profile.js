import express from "express";
import cors from "cors";

import { con } from "../connection/generation/dbConnection.js";
import { encPipeline } from "../connection/generation/encrypt.js";
import { decPipeline } from "../connection/generation/encrypt.js";
import { cacheStats } from "../lists.js";
import { statCache } from "../statInfo.js";
import { genderPreference } from "../lists.js";
import { expectationList } from "../lists.js";
import { updateBoth } from "../connection/generation/updateGenderPref.js";
import { generateSecureLink } from "../connection/generation/s3link.js";
import { deleteUser } from "../connection/generation/updateGenderPref.js";

export const profileRouter = express.Router();

profileRouter.post("/trial", function (req, res, next) {
  console.log("this is message: ", req.body);
  console.log("profile route is working");
  res.send("profile route is working");
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

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

//CHANGE VISIBILITY
profileRouter.post("/ChangeVisibility", (req, res) => {
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
              res.send();
              //swipeResult = await swipeList(con, "-1");
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

//Block Campus
profileRouter.post("/BlockCampus", (req, res) => {
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
              res.send("Okay");
              //swipeResult = await swipeList(con, "-1");
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

//Only Campus
profileRouter.post("/OnlyCampus", (req, res) => {
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
              res.send();
              //swipeResult = await swipeList(con, "-1");
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

//FrozeAccount
profileRouter.post("/FreezeAccount", (req, res) => {
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

//GET ONE USER INFO
profileRouter.post("/profileinfo", (req, res) => {
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

//MATCH MODE
profileRouter.post("/matchmode", (req, res) => {
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
profileRouter.post("/IdentityUpdate", (req, res) => {
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
              updateBoth(con, genderPreference, expectationList);
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
profileRouter.post("/Interests", (req, res) => {
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

//Securephoto link
profileRouter.post("/SecurePhotoLink", cors(corsOptions), async (req, res) => {
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

//LOAD USER PHOTO LINK
profileRouter.post("/AddPhotoLink", (req, res) => {
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
profileRouter.post("/deleteS3Photo", (req, res) => {
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
profileRouter.post("/deleteAccount", (req, res) => {
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

//GETTING PROFILE PICTURE LINK
profileRouter.post("/getProfilePic", (req, res) => {
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