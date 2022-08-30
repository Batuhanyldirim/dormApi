import express from "express";
import { con } from "../connections/dbConnection.js";
import { cacheStats } from "../lists.js";
import { statCache } from "../logic/statInfo.js";
import { dec } from "../middlewares/enc-dec.js";
import { auth } from "../middlewares/authentication.js";

export const statisticsRouter = express.Router();

statisticsRouter.post("/trial", function (req, res, next) {
  console.log("this is message: ", req.body);
  console.log("trial route is working");
  res.send("trial route is working");
});

//LINK CLICK COUNTER
statisticsRouter.post("/EventLinkClick", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const eventId = decBody.eventId;
  var sql = `UPDATE Events SET LinkClickCount = LinkClickCount + 1 WHERE EventId = ${eventId};`;
  con.query(sql, function (err, result) {
    try {
      cacheStats.dailyLinkClick += 1;
      cacheStats.cacheSize += 1;
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      res.send();
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

//EVENT CLICK COUNTER
statisticsRouter.post("/EventClick", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const eventId = decBody.eventId;
  var sql = `UPDATE Events SET click = click + 1 WHERE EventId = ${eventId};`;
  con.query(sql, function (err, result) {
    try {
      cacheStats.dailyEventClick += 1;
      cacheStats.cacheSize += 1;
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      res.send();
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

//DETAIL EVENT CLICK COUNTER
statisticsRouter.post("/detailEventClick", dec, auth, (req, res) => {
  let secKeys = req.body.secKeys;
  let decBody = req.body.decBody;
  const UserId = decBody.userId;

  const eventId = decBody.eventId;
  var sql = `UPDATE Events SET detailClick = detailClick + 1 WHERE EventId = ${eventId};`;
  con.query(sql, function (err, result) {
    try {
      cacheStats.dailyDetailClick += 1;
      cacheStats.cacheSize += 1;
      if (cacheStats.cacheSize > 50) {
        statCache();
      }
      res.send();
    } catch (err) {
      res.send(err);
    }
  });
});
