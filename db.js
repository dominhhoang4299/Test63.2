const { MongoClient } = require("mongodb");
const fs = require('fs')
const db = {};
// import data to MongoDB
const connectToDb = () => {
  const client = new MongoClient("mongodb://localhost:27017");
  client.connect(async () => {
    const database = client.db("your_db_name");
    const data = fs.readFileSync('./data.json');
    const jsonData = JSON.parse(data);
    db.inventories = database.collection("inventories");
    db.orders = database.collection("orders");
    db.users = database.collection("users");
    await db.collection("inventories").insertMany(jsonData.inventories);
    await db.collection("orders").insertMany(jsonData.orders);
    await db.collection("users").insertMany(jsonData.users);

  console.log("Data imported successfully!");
  });
};

module.export = { connectToDb, db };
