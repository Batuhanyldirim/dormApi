import { cacheStats } from "./lists.js";

export function statCache() {
  //add headers
  const options = {
    headers: { "access-token": token },
  };

  //create body payload
  const body = cacheStats;

  axios
    .post("https://adminpanelx.meetdorm.com/statDataCache", body, options)
    .then((response) => {
      //receive response
      if (response.statusCode == 200) {
        console.log(response);
        cacheStats = {
          cacheSize: 0,
          frozenUser: 0,
          dailyUnmatch: 0,
          newEvents: 0,
          dailyEventLike: 0,
          dailyEventClick: 0,
          dailyDetailClick: 0,
          dailyLinkClick: 0,
          dailyNewReport: 0,
        };
      } else {
        console.log("error on status");
      }
    })
    .catch((error) => {
      //console.log(error);
    });
}
