const { MongoClient } = require("mongodb");
const express = require('express');
const mongoose = require('mongoose');
const db = {};

const connectToDb = () => {
  const client = new MongoClient("mongodb://localhost:27017");
  client.connect(() => {
    const database = client.db("your_db_name");
    db.inventories = database.collection("inventories").insertMany([
      { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
      { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
      { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
      { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
    ]);
    db.orders = database.collection("orders").insertMany([
      { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
	 { "_id" : 3, "item" : "pecans", "price" : 20, "quantity" : 3 },
    ]);
    db.users = database.collection("users").insertMany([
      {"username": "admin", password: "MindX@2022"},
	{"username": "alice", password: "MindX@2022"}
    ]);
  });
mongoose.connect('mongodb://localhost:27017/inventory', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to inventory database");
});

const productSchema = new mongoose.Schema({
  id: Number,
  sku: String,
  description: String,
  instock: Number,
});
const Product = mongoose.model('Product', productSchema);

const app = express();
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving products" });
  }
});
app.get('/api/products', async (req, res) => {
    let query = {};
    if(req.query.lowQuantity === 'true') {
        query.quantity = { $lt: 100 };
    }
    const products = await Product.find(query);
    res.send(products);
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const port = 3000;
const secretKey = 'mySecretKey';

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const username = req.body.username;
  const token = jwt.sign({ username }, secretKey);
  res.json({ token });
});

function authorize(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).send('Forbidden');
  }
}

app.get('/protected', authorize, (req, res) => {
  res.send(`Hello, ${req.user.username}!`);
});
});


};




module.export = { connectToDb, db };
