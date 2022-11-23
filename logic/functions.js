import { checkList } from "../lists.js";
import { con } from "../connections/dbConnection.js";

export function checkMail(mail, mailKey) {
  var splitted = mail.split("@");
  if (splitted.length == 2 && splitted[1] == checkList[mailKey]) {
    //console.log("True");
    return true;
  }
  //console.log("false");
  return false;
}

export function syncQuery(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}

export function makeSqlList(userList) {
  var resultList = "(";

  for (var i = 0; i < userList.length; i++) {
    resultList += JSON.stringify(userList[i].userLiked) + ",";
  }
  if (resultList.length == 1) return "(0)";
  return resultList.slice(0, -1) + ")";
}

export function injectionCheck(input) {
  if (
    !input.includes(";") &&
    !(input.includes("(") && input.includes(")") && input.includes("SLEEP"))
  ) {
    return false;
  } else {
    return true;
  }
}
