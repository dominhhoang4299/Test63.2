const express = require("express");
const { connectToDb, db } = require("./db");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();

app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});
