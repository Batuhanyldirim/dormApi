import { checkList } from "../lists.js";

export function checkMail(mail, mailKey) {
  var splitted = mail.split("@");
  if (splitted.length == 2 && splitted[1] == checkList[mailKey]) {
    console.log("True");
    return true;
  }
  console.log("false");
  return false;
}
