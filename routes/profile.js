import express from "express";
import cors from "cors";

import { con } from "../connections/dbConnection.js";
import { s3 } from "../connections/s3bucket.js";
import { encPipeline } from "../generators/encrypt.js";
import { cacheStats, genderPreference, expectationList } from "../lists.js";
import { statCache } from "../logic/statInfo.js";
import { updateBoth, deleteUser } from "../logic/updateGenderPref.js";
import { generateSecureLink } from "../generators/s3link.js";
import { dec } from "../middlewares/enc-dec.js";
import { auth } from "../middlewares/authentication.js";
import { swipeList } from "../logic/swipeList.js";

export const profileRouter = express.Router();

function syncQuery(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}

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
  const bucketName = "dorm-img-dev";

  var params = { Bucket: bucketName, Key: imgKey };
  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // error
  });
}

//CHANGE VISIBILITY
profileRouter.post("/ChangeVisibility", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const UserId = decBody.userId;

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
});

//CHANGE BLUR
profileRouter.post("/changeBlur", dec, auth, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const userId = decBody.userId;
  const otherUser = decBody.otherUser;

  var sql = `SELECT blurTime, blurCount FROM User WHERE UserId = ${userId}`;

  var blur = await syncQuery(sql);
  var myCount = blur[0].blurCount;
  blur = blur[0].blurTime;

  var date = new Date();
  var now = date.toISOString();
  var blurTime = new Date(`${blur}`);
  //console.log("blurTime: ", blurTime);
  var diff = date.getTime() - blurTime.getTime();

  if (diff > 86400000 && myCount == 0) {
    sql = `UPDATE User SET blurCount = 1 WHERE UserId = ${userId}`;
    await syncQuery(sql);
  }
  /*   console.log("blur[0].blurCount: ", myCount);
  console.log("blur[0].blurCount > 0: ", myCount > 0);
  console.log("(diff > 86400000 && myCount == 0): ", diff > 86400000 && myCount == 0); */

  if (myCount > 0 || (diff > 86400000 && myCount == 0)) {
    sql = `UPDATE LikeOther SET blur = 0 WHERE userLiked = ${otherUser} AND otherUser = ${userId};`;
    await syncQuery(sql);
    if (diff > 86400000 && myCount == 0) {
      sql = `UPDATE User SET blurTime = '${now}' WHERE UserId = ${userId}`;
      await syncQuery(sql);
      res.send({ blurCount: 0 });
    }
    if (myCount == 1) {
      sql = `UPDATE User SET blurCount = blurCount - 1, blurTime = '${now}' WHERE UserId = ${userId}`;
      await syncQuery(sql);
      res.send({ blurCount: 0 });
    } else {
      sql = `UPDATE User SET blurCount = blurCount - 1 WHERE UserId = ${userId}`;
      await syncQuery(sql);
      res.send({ blurCount: myCount - 1 });
    }
  } else {
    res.status(400);
    res.send("Blur count has finished");
  }
});

//Block Campus
profileRouter.post("/BlockCampus", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;
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
});

//Only Campus
profileRouter.post("/OnlyCampus", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const UserId = decBody.userId;

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
});

//FrozeAccount
profileRouter.post("/FreezeAccount", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  var sql = `UPDATE User SET accountVisibility = 0, frozen = 1 WHERE UserId = ${UserId}`;
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
});

//GET ONE USER INFO
profileRouter.post("/profileinfo", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const userId = decBody.userId;
  const otherId = decBody.otherId;

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
});

//MATCH MODE
profileRouter.post("/matchmode", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const userId = decBody.userId;

  const matchMode = decBody.matchMode;

  var sql = `UPDATE User SET matchMode = '${matchMode}' WHERE UserId = '${userId}';`;
  con.query(sql, function (err, result) {
    try {
      res.send("Update is successfull");
    } catch (err) {
      res.send("matchMode Error");
    }
  });
});

//MATCH MODE2
profileRouter.post("/matchmode2", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const userId = decBody.userId;

  const matchMode = decBody.matchMode;

  var sql = `UPDATE User SET matchMode = '${matchMode}' WHERE UserId = '${userId}';`;
  con.query(sql, function (err, result) {
    try {
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
          if (userData.Invisible) {
            res.status(411);
            res.send("Invisible");
          } else {
            swipeList(
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
      });
    } catch (err) {
      res.send("matchMode Error");
    }
  });
});

//IDENTITY UPDATE
profileRouter.post("/IdentityUpdate", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;
  const Name = decBody.Name;
  const Surname = decBody.Surname;
  const Gender = decBody.Gender;
  const Major = decBody.Major;
  const Burc = decBody.Burc;
  const Beslenme = decBody.Beslenme;
  const Alkol = decBody.Alkol;
  const Sigara = decBody.Sigara;
  const About = decBody.About;
  const Expectation = decBody.Expectation;
  const InterestedSex = decBody.InterestedSex;
  const City = decBody.City ?? "İstanbul";

  var sql = `UPDATE User SET InterestedSex = ${InterestedSex}, Expectation = ${Expectation} , Name = '${Name}',Surname = '${Surname}',
  Gender = '${Gender}',Major = '${Major}',  Burc = '${Burc}', Beslenme = '${Beslenme}', Alkol = '${Alkol}', Sigara = '${Sigara}', 
  About = '${About}', City = '${City}'  WHERE UserId = ${UserId};`;
  con.query(sql, async function (err, result) {
    try {
      //swipeResult = await swipeList(con, "-1");
      res.send({
        Message: "Update is successfull",
      });
      updateBoth(genderPreference, expectationList);
    } catch (err) {
      res.send(err);
    }
  });
});

//INTERESTS
profileRouter.post("/Interests", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

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
});

//INTERESTS
profileRouter.post("/updateTutorial", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const tutorialName = decBody.tutorialName;

  var sql = `UPDATE User SET ${tutorialName} = 1`;
  con.query(sql, function (err, result) {
    try {
      res.send("update is successful");
    } catch (err) {
      res.send(err);
    }
  });
  //swipeResult = await swipeList(con, "-1");
  res.send({
    Message: "Update is successfull",
  });
});

//Securephoto link
profileRouter.post("/SecurePhotoLink", dec, auth, cors(corsOptions), async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  var userId = decBody.userId;

  let url = await generateSecureLink();
  url = encPipeline({ url }, secKeys);

  res.send(url);
});

//LOAD USER PHOTO LINK
profileRouter.post("/AddPhotoLink", dec, auth, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  var UserId = decBody.userId;

  var sql2 = `DELETE FROM Photos WHERE UserId=${UserId};`;
  await syncQuery(sql2);

  for (var i = 0; i < decBody.photos.length; i++) {
    var photoName = decBody.photos[i].PhotoLink.split("/");
    photoName = photoName[photoName.length - 1];
    var photoLink = "https://d13pzveje1c51z.cloudfront.net/" + photoName;
    //console.log("this is front link: ", photoLink);
    var sql = `INSERT INTO Photos (Photo_Order, PhotoLink, UserId) VALUES (${decBody.photos[i].Photo_Order} , '${photoLink}', ${UserId});`;
    await syncQuery(sql);
  }
  //swipeResult = await swipeList(con, "-1");
  res.send({
    Message: "Update is successfull",
  });
});

//DELETE PHOTO FROM S3
profileRouter.post("/deleteS3Photo", dec, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  deleteS3Image(decBody.photoName);
  res.send({
    Message: "Item deleted",
  });
});

//DeleteAccount
profileRouter.post("/deleteAccount", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

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
      const accountVisibility = userData.accountVisibility;
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
                              SOVisibility, GenderVisibility, accountVisibility, Alkol, Sigara, Burc, Beslenme, Major, Din, About, CreatedDate, matchMode, 
                              reportDegree, deletionDate) VALUES ('${mail}','${name}','${surName}',
                              '${city}','${bDay}','${school}','${gender}','${password}','${blockCampus}','${onlyCampus}','${invisible}','${premiumDate}',
                              '${LikeCount}','${SuperLikeCount}','${SwipeRefreshTime}','${UserId}','${Expectation}','${InterestedSex}','${SexualOrientation}',
                              '${SOVisibility}', '${GenderVisibility}', '${accountVisibility}', '${Alkol}', '${Sigara}', '${Burc}', '${Beslenme}',
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
});

//GETTING PROFILE PICTURE LINK
profileRouter.post("/getProfilePic", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  var otherId = decBody.otherId;

  var sql = `SELECT PhotoLink FROM Photos WHERE UserId = '${otherId}' AND Photo_Order = '1'`;
  con.query(sql, function (err, result) {
    try {
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  });
});
