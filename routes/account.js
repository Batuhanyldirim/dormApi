import express from "express";
import { con } from "../connections/dbConnection.js";
import { encPipeline } from "../generators/encrypt.js";
import { sendVerMail } from "../senders/verMail.js";
import { sessionTokenGenerator } from "../generators/sessionToken.js";
import { addUser } from "../logic/updateGenderPref.js";
import { appLists, genderPreference, expectationList } from "../lists.js";
import { dec } from "../middlewares/enc-dec.js";
import { setDate } from "../generators/endDateSet.js";
import { checkMail, injectionCheck, bulkInjectionCheck, between } from "../logic/functions.js";

export const accountRouter = express.Router();

//console.log("result: ", checkMail("asd@sabanciuniv.edu", 11));
accountRouter.post("/trial", function (req, res, next) {
  //console.log("this is message: ", req.body);
  //console.log("trial route is working");
  res.send("trial route is working");
});

//REGISTER
accountRouter.post("/register", dec, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const mail = decBody.mail;
  const mailKey = decBody.mailKey ?? -1;
  //if (mailKey == -1 || checkMail(mail, mailKey)) {

  if (
    bulkInjectionCheck([
      mail,
      decBody.name,
      decBody.surName,
      decBody.city,
      decBody.bDay,
      decBody.school,
      decBody.password,
    ])
  ) {
    console.log("Attack detected on register mail");
    res.status(400);
    res.send("Register Unsuccessful");
  } else {
    if (true) {
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
                const accountVisibility = 0;
                const likeCount = 20;
                const superLikeCount = 5;
                const onBoardingComplete = 0;
                const matchMode = 1;
                const reportDegree = 0;
                const SwipeRefreshTime = await setDate();
                const frozen = 0;
                const accountValidation = 0;

                var sql = `SELECT * FROM User WHERE Mail = '${mail}';`;

                con.query(sql, function (err, result) {
                  try {
                    if (result == "") {
                      var date = new Date();
                      date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                      var now = date.toISOString().slice(0, -5);
                      var sql = `INSERT INTO User (Mail, Name, Surname, City, Birth_date, School, Password, BlockCampus, OnlyCampus, 
                            Invisible, accountVisibility, CreatedDate, LikeCount, SuperLikeCount, onBoardingComplete, matchMode, 
                            SwipeRefreshTime, reportDegree, frozen, accountValidation) VALUES ('${mail}','${name}','${surName}','${city}',
                            '${bDay}', '${school}', '${password}', '${blockCampus}', '${onlyCampus}', '${invisible}', '${accountVisibility}', 
                            '${now}', ${likeCount}, ${superLikeCount}, ${onBoardingComplete}, '${matchMode}', '${SwipeRefreshTime}', '${reportDegree}', 
                            '${frozen}', ${accountValidation});`;
                      con.query(sql, function (err, result) {
                        try {
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
                                  console.log(err);
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
                              console.log(err);
                              res.status(400);
                              res.send(err);
                            }
                          });
                        } catch (err) {
                          console.log(err);
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
                console.log(err);
                res.status(400);
                res.send(err);
              }
            });

            //DELETE FROM `table_name` [WHERE condition];
          } else {
            console.log(err);
            res.status(400);
            res.send({ Verification: -1 });
          }
        } catch (err) {
          console.log(err);
          res.status(400);
          res.send(err);
        }
      });
    } else {
      res.status(400);
      res.send("Invalid e-mail");
    }
  }
});

//PASSWORD REGISTER
accountRouter.post("/PasswordRegister", dec, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const mail = decBody.mail;
  const password = decBody.password;
  var UserVerCode = decBody.verification;

  if (bulkInjectionCheck([mail, password])) {
    res.status(400);
    res.send("Unsuccessful attempt");
  } else {
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
  }
});

//AFTER REGISTER
accountRouter.post("/AfterRegister", dec, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
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
      const accountVisibility = 1;
      const matchMode = decBody.matchMode;
      const accountValidation = 1;

      if (
        bulkInjectionCheck([
          decBody.gender,
          decBody.expectation,
          decBody.interestedSex,
          decBody.sexualOrientation,
          decBody.SOVisibility,
          decBody.genderVisibility,
          decBody.matchMode,
        ])
      ) {
        res.status(400);
        res.send("Unsuccessful attempt");
      } else {
        addUser(genderPreference, userId, gender, SexualOrientation, expectationList, expectation);

        var sql = `UPDATE User SET Gender ='${gender}', Expectation ='${expectation}', InterestedSex ='${InterestedSex}', 
      SexualOrientation ='${SexualOrientation}', SOVisibility ='${SOVisibility}', GenderVisibility ='${GenderVisibility}', 
      onBoardingComplete = ${onBoardingComplete}, matchMode = ${matchMode}, accountVisibility = ${accountVisibility}, 
      accountValidation = ${accountValidation} WHERE UserId = ${userId};`;
        con.query(sql, async function (err, result) {
          try {
            //swipeResult = await swipeList(con, "-1");
          } catch (err) {
            res.send(err);
          }
        });
        res.send("AfterReg");
      }
    } else {
      res.status(410);
      res.send("Unauthorized Session");
    }
  });
});

//LOGIN
accountRouter.post("/Login", dec, async (req, res) => {
  //console.log("this is deviceId: ", deviceId);
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const password = decBody.password;
  const mail = decBody.mail;
  var myres = {
    authentication: "false",
    UserId: "-1",
  };

  if (injectionCheck(mail)) {
    console.log("attack");
    res.status(400);
    res.send("Böyle bir kullanıcı yok");
  } else {
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
              var sql = `UPDATE User SET accountVisibility = 1, frozen = 0 WHERE UserId = ${userData.UserId}`;
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
                    var date = new Date();

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
                      sexualOrientation: `${userData.SexualOrientation}`,
                      SOVisibility: `${userData.SOVisibility}`,
                      Major: `${userData.Major}`,
                      Din: `${userData.Din}`,
                      Burc: `${userData.Burc}`,
                      Beslenme: `${userData.Beslenme}`,
                      Alkol: `${userData.Alkol}`,
                      Sigara: `${userData.Sigara}`,
                      About: `${userData.About}`,
                      Photo: myPhotos,
                      interest: myInterests,
                      sesToken: sesToken,
                      onBoardingComplete: userData.onBoardingComplete,
                      matchMode: userData.matchMode,
                      City: userData.City,
                      applists: appLists,
                      blurCount: userData.blurCount,
                      tutorial1: userData.tutorial1,
                      tutorial2: userData.tutorial2,
                      tutorial3: userData.tutorial3,
                      tutorial4: userData.tutorial4,
                      tutorial5: userData.tutorial5,
                      tutorial6: userData.tutorial6,
                    };
                    //console.log(myres);

                    myres = encPipeline(myres, secKeys);
                    res.send(myres);
                  } catch (err) {
                    console.log(err);
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
  }
});

//SEND VERIFICATION
accountRouter.post("/SendVerification", dec, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const Mail = decBody.mail;
  const isNewUser = decBody.isNewUser;
  var verCode = between(1000, 10000);
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  var now = date.toISOString().slice(0, -2);

  if (injectionCheck(Mail)) {
    res.status(400);
    res.send("Unable to send verification");
  } else {
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
  }
});

//CHECK VERIFICATION
accountRouter.post("/CheckVerification", dec, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const Mail = decBody.mail;
  var UserVerCode = decBody.verCode;

  if (bulkInjectionCheck([Mail, UserVerCode])) {
    res.status(400);
    res.send("Unvalid Code");
  } else {
    var sql = `SELECT * FROM Verification WHERE VerMail = '${Mail}';`;
    con.query(sql, function (err, result) {
      try {
        if (result[0] == undefined) {
          res.status(400);
          res.send({ Verification: -1 });
        } else if (result[0]["attempt"] > 0 && result[0]["VerCode"] == UserVerCode) {
          res.send({ Verification: 1 });
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
  }
});
