const express = require("express");
const { connectToDb, db } = require("./db");

const app = express();

app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});
