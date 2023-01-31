/* 
Authentication for endpoints
*/

import { con } from "../connections/dbConnection.js";

export function auth(req, res, next) {
  var token = req.headers["access-token"];
  var sql = `SELECT UserId FROM sesToken WHERE sesToken = '${token}'`;
  con.query(sql, async function (err, result) {
    const userId = req.body.decBody.userId;

    if (result != undefined && result.length != 0 && result[0].UserId == userId) {
      next();
    } else {
      res.status(410);
      res.send("Unauthorized Session");
    }
  });
}
