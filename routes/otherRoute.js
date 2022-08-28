import express from "express";
export const router2 = express.Router();

// 3.
router2.get("/trail2", function (req, res, next) {
  console.log("trial2 route is working");
  res.send("trial2 route is working");
});
