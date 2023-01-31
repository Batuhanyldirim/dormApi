/* 
Performs scheduled tasks periodically
*/

import cron from "node-cron";

async function deleteEvents(con) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() + 1);
  var referanceDate = date.toISOString().slice(0, 10);

  var sql = `UPDATE Events SET visible = 0, deleted = 1 WHERE (Date < '${referanceDate}' AND endDate = "") OR (endDate < '${referanceDate}' AND endDate != "");`;
  con.query(sql, function (err, result) {
    try {
      res.send("Event has sdeleted");
    } catch (err) {
      res.send(err);
    }
  });
}

async function deleteDislike(con) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() - 14);
  var referanceDate = date.toISOString().slice(0, 16);
  var sql = `DELETE ActedOther, DislikeOther FROM ActedOther INNER JOIN DislikeOther ON DislikeOther.PersonDisliked = ActedOther.UserActed AND DislikeOther.otherPerson = ActedOther.otherUser WHERE DislikeOther.DislikeDate < '${referanceDate}';`;
  con.query(sql, function (err, result) {
    try {
      res.send("Dislikes has deleted");
    } catch (err) {
      res.send(err);
    }
  });
}

async function deleteDeviceId(con) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() - 2);
  var referanceDate = date.toISOString().slice(0, 16);
  var sql = `DELETE FROM deviceId WHERE date < '${referanceDate}'`;
  con.query(sql, function (err, result) {
    try {
      res.send("Device Ids has deleted");
    } catch (err) {
      res.send(err);
    }
  });
}

async function deleteToken(con) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() - 5);
  var referanceDate = date.toISOString().slice(0, 16);
  var sql = `DELETE FROM sesToken WHERE Date < '${referanceDate}'`;
  con.query(sql, function (err, result) {
    try {
      res.send("Tokens has deleted");
    } catch (err) {
      res.send(err);
    }
  });
}

async function deleteVerification(con) {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() - 2);
  var referanceDate = date.toISOString().slice(0, 16);
  var sql = `DELETE FROM Verification WHERE Date < '${referanceDate}'`;
  con.query(sql, function (err, result) {
    try {
      res.send("Verifications has deleted");
    } catch (err) {
      res.send(err);
    }
  });
}

async function daily(con) {
  cron.schedule("05 03 * * *", function () {
    deleteEvents(con);
    deleteDislike(con);
    deleteDeviceId(con);
    deleteToken(con);
    deleteVerification(con);
  });
}

async function demo2(con) {
  cron.schedule("*/2 * * * * *", function () {
    console.log("in every 2 second");
  });
}

export async function demoFunc(con) {
  daily(con);
  demo2(con);
}
