export async function setDate() {
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
