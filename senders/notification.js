import axios from "axios";

export async function sendNotification(matchId, sender, otherUser, matchMode, token) {
  //add headers
  const options = {
    headers: { "access-token": token },
  };

  //create body payload
  const body = {
    sender: sender,
    usertobeSent: otherUser,
    matchId: matchId,
    matchMode: matchMode,
  };

  axios
    .post("https://devmessage.meetdorm.com/newMatch", body, options)
    .then((response) => {
      //receive response
      console.log(response);
    })
    .catch((error) => {
      //console.log(error);
    });
}

export async function likeNotification(sender, otherUser, eventId, token) {
  //add headers
  const options = {
    headers: { "access-token": token },
  };

  //create body payload
  const body = {
    sender: sender,
    usertobeSent: otherUser,
  };

  axios
    .post("https://devmessage.meetdorm.com/likeNotification", body, options)
    .then((response) => {
      //receive response
      console.log(response);
    })
    .catch((error) => {
      //console.log(error);
    });
}
