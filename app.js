/* 
Route branch modification
*/

import express from "express";
import bp from "body-parser";
import dotenv from "dotenv";
import AWS from "aws-sdk";

//import { checkDislikeDate } from "./connection/generation/endDateSet.js";
//import { updateGenderPreference } from "./connection/generation/updateGenderPref.js";
//import { encryiptData } from "./connection/generation/encrypt.js";

import { generateSecureLink } from "./generators/s3link.js";
import { con } from "./connections/dbConnection.js";

import { updateBoth } from "./logic/updateGenderPref.js";
import { genderPreference, expectationList } from "./lists.js";

import { accountRouter } from "./routes/account.js";
import { statisticsRouter } from "./routes/statistics.js";
import { profileRouter } from "./routes/profile.js";
import { userActionRouter } from "./routes/userAction.js";
import { listsRouter } from "./routes/lists.js";
import { mainRouter } from "./routes/main.js";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCES_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

app.use("/", mainRouter);
app.use("/account", accountRouter);
app.use("/statistics", statisticsRouter);
app.use("/profile", profileRouter);
app.use("/userAction", userActionRouter);
app.use("/lists", listsRouter);

updateBoth(genderPreference, expectationList);

/* 
const con = mysql.createConnection({
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
});
 */
