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

export function bulkInjectionCheck(input) {
  for (i = 0; i < input.length; i++) {
    if (injectionCheck(input[i])) {
      return true;
    }
  }
  return false;
}

export function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function eventOrder(idList, eventList) {
  var idMap = {};
  var promotedEvents = [];

  for (var i = 0; i < idList.length; i++) {
    if (idMap[idList[i]] == undefined) {
      idMap[idList[i]] = 1;
    }
  }

  for (var i = 0; i < eventList.length; i++) {
    if (idMap[eventList[i].EventId] != undefined) {
      promotedEvents.push(eventList[i]);
      eventList.splice(i, 1);
    }
  }

  return promotedEvents.concat(eventList);
}
