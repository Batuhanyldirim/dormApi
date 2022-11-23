import axios from "axios";

export async function sendNotification(matchId, sender, otherUser, matchMode, token) {
  try {
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
  } catch (err) {
    console.log({ err });
  }
}

export async function likeNotification(sender, otherUser, eventId, eventName, token) {
  try {
    //add headers
    const options = {
      headers: { "access-token": token },
    };

    //create body payload
    const body = {
      sender: sender,
      usertobeSent: otherUser,
      eventId: eventId,
      eventName: eventName,
    };
    //var link = "http://localhost:3002/likeNotification";
    var link = "https://devmessage.meetdorm.com/likeNotification";
    console.log("like notif sent");
    axios
      .post(link, body, options)
      .then((response) => {
        //receive response
        //console.log(response);
      })
      .catch((error) => {
        //console.log(error);
      });
  } catch (err) {
    console.log({ err });
  }
}
