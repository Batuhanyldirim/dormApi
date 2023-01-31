import { checkList } from "../lists.js";
import { con } from "../connections/dbConnection.js";


//Check mail validation
export function checkMail(mail, mailKey) {
  var splitted = mail.split("@");
  if (splitted.length == 2 && splitted[1] == checkList[mailKey]) {
    //console.log("True");
    return true;
  }
  //console.log("false");
  return false;
}

//function for performing database actions synchronously
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

//creates insert SQL statements for adding given user list
export function makeSqlList(userList) {
  var resultList = "(";

  for (var i = 0; i < userList.length; i++) {
    resultList += JSON.stringify(userList[i].userLiked) + ",";
  }
  if (resultList.length == 1) return "(0)";
  return resultList.slice(0, -1) + ")";
}

//Checks if there is an SQL injection attack
export function injectionCheck(inp) {
  var strInp = JSON.stringify(inp);
  if (
    !strInp.includes(";") &&
    !(strInp.includes("(") && strInp.includes(")") && strInp.includes("SLEEP"))
  ) {
    return false;
  } else {
    return true;
  }
}

//Checks if there is an SQL injection attack on bulk insert to database
export function bulkInjectionCheck(inp) {
  for (var i = 0; i < inp.length; i++) {
    if (injectionCheck(inp[i])) {
      return true;
    }
  }
  return false;
}

//Number generatr between given values
export function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//If we made a deal with an event, we are listing them on the top with that function
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
