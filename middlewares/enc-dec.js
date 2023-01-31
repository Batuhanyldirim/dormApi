/* 
Encodes and decodes all traffic between server and client
*/

import { con } from "../connections/dbConnection.js";
import { decPipeline } from "../generators/encrypt.js";

//Authenticates endpoints with respect to their userId and session token from database

export function dec(req, res, next) {
  let deviceId = req.body.dormId;

  var sql = `SELECT * FROM deviceId WHERE deviceId = '${deviceId}'`;
  con.query(sql, function (err, result) {
    try {
      if (result.length != 0) {
        var secKeys = result;
        req.body.secKeys = result;
        req.body.decBody = decPipeline(req.body.message, secKeys);
        if (req.body.decBody != undefined) {
          next();
        } else {
          res.status(420);
          res.send("There is an error in your request");
          return;
        }
      } else {
        res.status(420);
        res.send("There is an error in your request");
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(420);
      res.send(
        "Giriş yapmak için uygulamayı güncellemeniz gerekmektedir. Yeni güncelleme kritik güvenlik önlemleri sağladığı için uygulamayı kullanmaya devam edebilmek için lütefn uygulamayı güncelleyin. "
      );
      return;
    }
  });
}
