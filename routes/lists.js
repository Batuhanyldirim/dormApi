import express from "express";

import { con } from "../connections/dbConnection.js";
import { encPipeline } from "../generators/encrypt.js";
import { genderPreference, expectationList } from "../lists.js";
import { swipeList } from "../logic/swipeList.js";
import { choseList } from "../logic/choseList.js";
import { dec } from "../middlewares/enc-dec.js";
import { auth } from "../middlewares/authentication.js";
import { demoAccounts } from "../lists.js";
import { syncQuery, makeSqlList, eventOrder } from "../logic/functions.js";

export const listsRouter = express.Router();

listsRouter.post("/trial", function (req, res, next) {
  console.log("this is message: ", req.body);
  console.log("lists route is working");
  res.send("lists route is working");
});

//GET EVENT LIST
listsRouter.post("/EventList", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  var UserId = decBody.userId ?? 0;

  var campus = decBody.kampus ?? ""; //result4[0].School;

  var city = decBody.city ?? "İstanbul";

  var sql = `SELECT * FROM Events WHERE city = '${city}' AND (Kampus = '0' OR Kampus = '${campus}') AND visible = 1 ORDER BY Date ASC;`;
  //console.log(sql);
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

              /* var ifCock = false;
              var fromIdx;
              for (let i = 0; i < event_list.length; i++) {
                if (event_list[i].EventId == 1208 || event_list[i].EventId == 1123) {
                  fromIdx = i;
                  ifCock = true;
                  break;
                }
              }
              if (ifCock) {
                const element = event_list.splice(fromIdx, 1)[0];
                event_list.splice(0, 0, element);
                //console.log(event_list[0]);
              } */
              event_list = eventOrder([1297, 1299, 1300], event_list);

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
});

//SWIPE LIST
listsRouter.post("/SwipeList", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  //console.log({ decBody });

  var userId = decBody.userId;

  var minAge = decBody.age[0];
  var maxAge = decBody.age[1];
  var cinsiyet = decBody.cinsiyet;

  var alcohol = decBody.alkol;
  var cigar = decBody.sigara;
  var food = decBody.yemek;
  var sql2 = `SELECT Gender, InterestedSex, matchMode, Expectation, BlockCampus, OnlyCampus, School, Invisible, City FROM User WHERE UserId =${userId};`;
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
          userData.City,
          secKeys
        );
      }
    } catch (err) {
      console.log(err);
      res.send("error");
    }
  });
});

//EVENT PARTICIPANTS
listsRouter.post("/eventParticipants", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  var eventId = decBody.eventId;
  var userId = decBody.userId;

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
              AND UserId IN ${resultSwipeId} AND UserId != ${userId} AND ((BlockCampus = 1
              AND School != '${userData.School}') OR (OnlyCampus = 1 AND School = '${userData.School}') OR (OnlyCampus = 0 AND BlockCampus = 0)) AND UserId NOT IN 
              (SELECT otherUser FROM ActedOther WHERE userActed = '${userId}') AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${userId}'); 
              AND UserID NOT IN ${demoAccounts} AND Invisible = 0`;
            } else if (result2[0].likeMode == 1) {
              var sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About FROM 
              User WHERE UserId IN (SELECT UserId FROM LikeEvent WHERE EventId = ${eventId} AND Invisible = 0 AND likeMode = 1) AND UserId != ${userId} AND ((BlockCampus = 1 
              AND School != '${userData.School}') OR (OnlyCampus = 1 AND School = '${userData.School}') OR (OnlyCampus = 0 AND BlockCampus = 0)) AND UserId NOT IN (SELECT otherUser FROM ActedOther WHERE userActed = '${userId}') 
              AND UserId NOT IN (SELECT sikayetEdilen FROM rapor WHERE sikayetEden = '${userId}') AND UserID NOT IN ${demoAccounts} AND Invisible = 0`;
            }
            //console.log("sql: ", sql);
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
});

//USERS LIKED YOU
listsRouter.post("/usersLikedYou", dec, auth, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  var userId = decBody.userId;

  var sql = `SELECT userLiked, likeMode, blur, eventId FROM LikeOther WHERE otherUser = ${userId} 
  AND userLiked NOT IN (SELECT otherUser FROM ActedOther WHERE userActed = ${userId}) AND userLiked NOT IN ${demoAccounts}`;

  var usersLiked = await syncQuery(sql);

  var likeIds = makeSqlList(usersLiked);

  sql = `SELECT Name, City, Birth_Date, UserId, Gender, Surname, School, Major, Din, Burc, Beslenme, Alkol, Sigara, About, blurTime FROM 
  User WHERE UserId IN ${likeIds} AND UserId NOT IN ${demoAccounts}`;
  //console.log(sql);
  var users = await syncQuery(sql);

  sql = `SELECT blurTime, blurCount FROM User WHERE UserId = ${userId} AND UserId NOT IN ${demoAccounts}`;

  var myBlurTime = await syncQuery(sql);
  var myCount = myBlurTime[0].blurCount;
  myBlurTime = myBlurTime[0].blurTime;

  var date = new Date();
  var now = date.toISOString();
  var blurTime = new Date(`${myBlurTime}`);
  //console.log("blurTime: ", blurTime);
  var diff = date.getTime() - blurTime.getTime();

  if (diff > 86400000 && myCount == 0) {
    sql = `UPDATE User SET blurCount = 1 WHERE UserId = ${userId}`;
    await syncQuery(sql);
  }

  var likeListResult = { diff: diff, swipe_list: [] };

  var swipe_list = [];
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    user["blur"] = usersLiked[i].blur;
    user["likeMode"] = usersLiked[i].likeMode;
    user["eventId"] = usersLiked[i].eventId;
    user["photos"] = [];
    user["interest"] = [];
    swipe_list.push(JSON.parse(JSON.stringify(user)));
  }

  sql = `SELECT * FROM Photos WHERE UserId IN ${likeIds}`;
  var photos = await syncQuery(sql);
  for (let i = 0; i < photos.length; i++) {
    for (let j = 0; j < swipe_list.length; j++) {
      if (swipe_list[j].UserId == photos[i].UserId) {
        swipe_list[j]["photos"].push(photos[i]);
      }
    }
  }

  sql = `SELECT * FROM Interested WHERE UserId IN ${likeIds}`;

  var interests = await syncQuery(sql);

  for (let i = 0; i < interests.length; i++) {
    for (let j = 0; j < swipe_list.length; j++) {
      if (swipe_list[j].UserId == interests[i].UserId) {
        swipe_list[j]["interest"].push(interests[i]);
      }
    }
  }

  //console.log(swipe_list.length);
  //swipe_list = swipe_list.sort(() => Math.random() - 0.5);
  //swipe_list = encPipeline(swipe_list, secKeys);
  //console.log("len: ", swipe_list.length);
  likeListResult.swipe_list = swipe_list;
  //console.log(likeListResult);
  likeListResult = encPipeline(likeListResult, secKeys);
  //console.log(likeListResult.swipe_list.length);
  res.send(likeListResult);
});

//GET LIKED EVENTS
listsRouter.post("/getLikedEvent", dec, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  const UserId = decBody.userId;

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
});

//GET MATCH LIST
listsRouter.post("/matchList", async (req, res) => {
  var userId = req.body.userId;
  var sql2 = `SELECT MatchR.MId1, MatchR.MId2, MatchR.MatchId, MatchR.ChatEmpty, MatchR.SuperMatch, MatchR.matchMode, 
  MatchR.eventId, MatchR.date, Events.Description FROM MatchR, Events WHERE (MatchR.MId1 = ${userId} OR MatchR.MId2 = ${userId}) 
  AND MatchR.eventId = Events.EventId`;
  con.query(sql2, function (err, result2) {
    try {
      res.send(result2);
    } catch (err) {
      res.status(400);
      res.send("Error");
    }
  });
});
