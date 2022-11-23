import express from "express";

import { con } from "../connections/dbConnection.js";
import { cacheStats } from "../lists.js";
import { statCache } from "../logic/statInfo.js";
import { sendNotification, likeNotification } from "../senders/notification.js";
import { setDate } from "../generators/endDateSet.js";
import { dec } from "../middlewares/enc-dec.js";
import { auth } from "../middlewares/authentication.js";

export const userActionRouter = express.Router();

userActionRouter.post("/trial", function (req, res, next) {
  console.log("this is message: ", req.body);
  console.log("userAction route is working");
  res.send("userAction route is working");
});

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

//Like/Dislike
userActionRouter.post("/LikeDislike", dec, async (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  var token = req.headers["access-token"];
  var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
  con.query(sql, async function (err, result) {
    const userLiked = decBody.userSwiped;
    if (result.length != 0 && result[0].UserId == userLiked) {
      const isLike = decBody.isLike;
      const otherUser = decBody.otherUser;
      const matchMode = decBody.matchMode;
      var eventId = decBody?.eventId;
      var eventName = decBody.eventName ?? "";
      var date = new Date();
      var now = date.toISOString().slice(0, 16);

      var sql8 = `SELECT LikeCount, SuperLikeCount, SwipeRefreshTime FROM User WHERE Userid = ${userLiked};`;

      con.query(sql8, async function (err, result4) {
        try {
          var likeCount = JSON.parse(JSON.stringify(result4).slice(1, -1)).LikeCount;
          var superLikeCount = JSON.parse(JSON.stringify(result4).slice(1, -1)).SuperLikeCount;
          var SwipeRefreshTime = JSON.parse(JSON.stringify(result4).slice(1, -1)).SwipeRefreshTime;

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

                    try {
                      likeNotification(userLiked, otherUser, eventId, eventName, token);
                    } catch (err) {
                      console.log({ err });
                    }
                  } else if (isLike == 0 && likeCount < 2) {
                    likeCount = 19;
                    var sql = `INSERT INTO LikeOther (userLiked, otherUser, LikeDate, Superlike, likeMode, eventId) VALUES ('${userLiked}','${otherUser}','${actionDate}','0', '${matchMode}', ${eventId});`;
                    var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','0');`;
                    var sql9 = `UPDATE User SET LikeCount = ${19} WHERE UserId = ${userLiked}`;
                    try {
                      likeNotification(userLiked, otherUser, eventId, eventName, token);
                    } catch (err) {
                      console.log({ err });
                    }
                  } else if (isLike == 1) {
                    superLikeCount = superLikeCount - 1;
                    var sql = `INSERT INTO LikeOther (userLiked, otherUser, LikeDate, Superlike, likeMode, eventId) VALUES ('${userLiked}','${otherUser}','${actionDate}','1', '${matchMode}', ${eventId});`;
                    var sql7 = `INSERT INTO ActedOther (userActed, otherUser, ActDate, Superlike) VALUES ('${userLiked}','${otherUser}','${actionDate}','1');`;
                    var sql9 = `UPDATE User SET SuperLikeCount = ${superLikeCount} WHERE UserId = ${userLiked};`;
                    try {
                      likeNotification(userLiked, otherUser, eventId, eventName, token);
                    } catch (err) {
                      console.log({ err });
                    }
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
});

//LIKE EVENT
userActionRouter.post("/likeEvent", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const eventId = decBody.eventId;
  const likeMode = decBody.likeMode;
  var sql = `INSERT INTO LikeEvent (EventId, UserId, likeMode) VALUES ('${eventId}', '${UserId}', ${likeMode});`;
  con.query(sql, function (err, result) {
    try {
      cacheStats.dailyEventLike += 1;
      cacheStats.cacheSize += 1;
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      res.send({
        Message: "Event liked",
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

//DISLIKE EVENT
userActionRouter.post("/dislikeEvent", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const eventId = decBody.eventId;
  var sql = `DELETE FROM LikeEvent WHERE EventId = ${eventId} AND UserId = ${UserId};`;
  con.query(sql, function (err, result) {
    try {
      res.send({
        Message: "Event Disliked",
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

//UNMATCH
userActionRouter.post("/unmatch", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;

  var UserId = decBody.userId;

  var unmatchId = decBody.unmatchId;
  var sql = `DELETE FROM MatchR WHERE MatchId = ${unmatchId}`;
  con.query(sql, function (err, result) {
    try {
      cacheStats.dailyUnmatch += 1;
      cacheStats.cacheSize += 1;
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      res.send("Unmatched");
    } catch (err) {
      res.send(err);
    }
  });
});
