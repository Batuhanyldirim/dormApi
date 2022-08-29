import mysql from "mysql2";
import { choseList } from "./choseList.js";
import { encPipeline } from "../generators/encrypt.js";
import { demoAccounts } from "../lists.js";
import { con } from "../connections/dbConnection.js";

export async function swipeList(
  UserId,
  minAge,
  maxAge,
  cinsiyet,
  alcohol,
  cigar,
  res,
  gender,
  interestedSex,
  genderPreference,
  expectationList,
  matchMode,
  expectation,
  blockCampus,
  onlyCampus,
  school,
  secKeys
) {
  try {
    var date = new Date();
    var now = date.toISOString().substring(0, 10);
    var thisYear = parseInt(now.substring(0, 4));
    var maxBirth = now.replace(thisYear, (thisYear - minAge).toString());
    var minBirth = now.replace(thisYear, (thisYear - maxAge).toString());

    var genderList = "(";
    if (cinsiyet[0] == 1) genderList += "0,";
    if (cinsiyet[1] == 1) genderList += "1,";
    if (cinsiyet[2] == 1) genderList += "2,";
    if (genderList[genderList.length - 1] == ",")
      genderList = genderList.substring(0, genderList.length - 1);
    genderList += ")";

    if (cinsiyet[0] == 0 && cinsiyet[1] == 0 && cinsiyet[2] == 0) {
      genderList = "(0,1,2)";
    }
    /* var alcoholList = "(";
  if (alcohol[0] == 1) alcoholList += "0,";
  if (alcohol[1] == 1) alcoholList += "1,";
  if (alcohol[2] == 1) alcoholList += "2,";
  if (alcoholList[alcoholList.length - 1] == ",")
    alcoholList = alcoholList.substring(0, alcoholList.length - 1);
  alcoholList += ")"; */

    /* var cigarList = "(";
  if (cigar[0] == 1) cigarList += "0,";
  if (cigar[1] == 1) cigarList += "1,";
  if (cigar[2] == 1) cigarList += "2,";
  if (cigarList[cigarList.length - 1] == ",")
    cigarList = cigarList.substring(0, cigarList.length - 1);
  cigarList += ")"; */

    /* var foodList = "(";
  if (food[0] == 1) foodList += "0,";
  if (food[1] == 1) foodList += "1,";
  if (food[2] == 1) foodList += "2,";
  if (food[3] == 1) foodList += "3,";
  if (food[4] == 1) foodList += "4,";
  if (foodList[foodList.length - 1] == ",") foodList = foodList.substring(0, foodList.length - 1);
  foodList += ")"; */

    var campusFilter = ``;

    if (onlyCampus) campusFilter = ` School = '${school}' AND`;
    else if (blockCampus) campusFilter = ` School != '${school}' AND`;

    if (matchMode == 0) {
      var swipeId = choseList(
        genderPreference,
        gender,
        interestedSex,
        expectationList,
        expectation
      );
      //console.log(swipeId);

      var resultSwipeId = "(";
      for (let i = 0; i < swipeId.length; i++) {
        resultSwipeId += JSON.stringify(swipeId[i]);
        resultSwipeId += ",";
      }

      if (resultSwipeId.length == 1) resultSwipeId += "0";
      if (resultSwipeId.length > 2)
        resultSwipeId = resultSwipeId.substring(0, resultSwipeId.length - 1);
      resultSwipeId += ")";
      var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM User 
  WHERE UserId != '${UserId}' AND UserID NOT IN ${demoAccounts} AND${campusFilter} Birth_date < '${maxBirth}' AND Birth_date > '${minBirth}' AND matchMode = 0 
  AND Invisible = 0 AND AccountValidation = 1 AND ((BlockCampus = 1 AND School != '${school}') OR (OnlyCampus = 1 AND School 
    = '${school}') OR (OnlyCampus = 0 AND BlockCampus = 0)) AND UserId IN ${resultSwipeId} AND UserId NOT IN (SELECT otherUser FROM ActedOther 
    WHERE userActed = '${UserId}') AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${UserId}');`;
    } else if (matchMode == 1) {
      /* console.log("UserId: " + UserId);  
      console.log("campusFilter: " + campusFilter);
      console.log("maxBirth: " + maxBirth);
      console.log("school: " + school);
      console.log("minBirth: " + minBirth);
      console.log("genderList: " + genderList); */

      var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM User 
  WHERE UserId != '${UserId}' AND UserID NOT IN ${demoAccounts} AND${campusFilter} matchMode = 1 AND Birth_date < '${maxBirth}' AND ((BlockCampus = 1 AND School != '${school}') 
  OR (OnlyCampus = 1 AND School = '${school}') OR (OnlyCampus = 0 AND BlockCampus = 0)) AND Birth_date > '${minBirth}' 
  AND AccountValidation = 1 AND Invisible = 0 AND Gender IN ${genderList} AND UserId NOT IN (SELECT otherUser 
    FROM ActedOther WHERE userActed = '${UserId}') AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${UserId}');`;
    }
  } catch (err) {
    res.send("error");
  }

  con.query(sql, function (err, result) {
    try {
      //console.log("this is result: " + result);

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
              swipe_list = swipe_list.sort(() => Math.random() - 0.5);
              if (swipe_list.length > 40) swipe_list = swipe_list.slice(0, 40);
              //console.log(swipe_list.length);
              //console.log("swipe_list: " + swipe_list);
              swipe_list = encPipeline(swipe_list, secKeys);
              res.send(swipe_list);
            } catch (err) {
              console.log(err);
              res.send("Error in interest query");
            }
          });
        } catch (err) {
          res.send("Error in photo query");
        }
      });
    } catch (err) {
      console.log(err);
      res.send("Error in selecting user");
    }
  });
}

/* import mysql from "mysql2/promise";

const con = await mysql.createConnection({
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
});

export async function swipeList(con, UserId) {
  var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM User WHERE UserId != '${UserId}' AND UserId NOT IN (SELECT otherUser FROM ActedOther WHERE userActed = '${UserId}');`;
  var swipe_list = {};
  await con
    .promise()
    .query(sql)
    .then(async ([rows, fields]) => {
      Promise.all(
        rows.map((item) => {
          let user = item;
          user["photos"] = [];
          user["interest"] = [];
          swipe_list[user.UserId] = user;
        })
      );

      var sql = `SELECT * FROM Photos;`;
      await con
        .promise()
        .query(sql)
        .then(async ([rows, fields]) => {
          Promise.all(
            rows.map((item) => {
              for (let key in swipe_list) {
                if (key == item.UserId) {
                  swipe_list[key]["photos"].push(item);
                }
              }
            })
          );
          var sql = `SELECT * FROM Interested;`;
          await con
            .promise()
            .query(sql)
            .then(([rows, fields]) => {
              Promise.all(
                rows.map((item) => {
                  for (let key in swipe_list) {
                    if (key == item.UserId) {
                      swipe_list[key]["interest"].push(item);
                    }
                  }
                })
              );

              //swipe_list = swipe_list.sort(() => Math.random() - 0.5);
              //console.log(swipe_list);
              return swipe_list;
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  return swipe_list;
} */
