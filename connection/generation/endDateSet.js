// 31 --> 1, 3, 5, 7, 8, 10
// 30 --> 4, 6, 9, 11
// 28 --> 2

export async function setDate() {
  /*   var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  var now = date.toISOString().substring(0, 16);

  var thisYear = parseInt(now.substring(0, 4));
  var thisMonth = parseInt(now.substring(5, 7));
  var today = parseInt(now.substring(8, 10));

  var endYear = thisYear;
  var endMonth = thisMonth;
  var endDay = today;

  //var maxBirth = now.replace(thisYear, (thisYear - minAge).toString());
  //var minBirth = now.replace(thisYear, (thisYear - maxAge).toString()); 

  if (thisMonth == 12 && today == 31) {
    endYear += 1;
    endMonth = 1;
    endDay = 1;
  } else if (today == 31) {
    endMonth += 1;
    endDay = 1;
  } else if (
    (thisMonth == 4 || thisMonth == 6 || thisMonth == 9 || thisMonth == 11) &&
    today == 30
  ) {
    endMonth += 1;
    endDay = 1;
  } else if (thisYear % 4 == 0 && today == 29) {
    endMonth += 1;
    endDay = 1;
  } else if (thisYear % 4 != 0 && today == 28) {
    endMonth += 1;
    endDay = 1;
  } else {
    endDay += 1;
  }

  var endDate = now.replace(thisYear, endYear.toString());
  endDate = now.replace(thisMonth, endMonth.toString());
  endDate = now.replace(today, endDay.toString());
  //console.log("This is end date:" + endDate); */

  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() + 1);
  var endDate = date.toISOString().substring(0, 16);

  return endDate;
}

export function checkDislikeDate() {
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  date.setDate(date.getDate() - 10);
  var now = date.toISOString().substring(0, 16);
  console.log(now);
}
