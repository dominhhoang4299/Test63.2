const express = require("express");
const { connectToDb, db } = require("./db");

const app = express();
const jwt = require('jsonwebtoken');

app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});
//Write an api endpoint for that getting all products in inventory
app.get('/inventories', async (req, res) => {
  const inventories = await db.inventories.find().toArray();
  res.send(inventories);
});
//Update the API to accept a query for getting only products that have low quantity (less than 100).
app.get('/inventories', async (req, res) => {
  const query = req.query.lowQuantity ? { quantity: { $lt: 100 } } : {};
  const inventories = await db.inventories.find(query).toArray();
  res.send(inventories);
});
//Create a login API. Generate a token when user get login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const token = jwt.sign({ username }, 'your_secret_key');
  res.json({ token });
});
//Restrict the resource. Only logged-in user can visit it.
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
//Create an API for getting orders with the description of product inside each order.
app.get('/orders', async (req, res) => {
  const orders = await db.orders.find().toArray();
  const inventories = await db.inventories.find({ _id: { $in: orders.map(order => order.productId) } }).toArray();

  const ordersWithProduct = orders.map(order => ({
    ...order,
    product: inventories.find(inventory => inventory._id.equals(order.productId))
  }));

  res.send(ordersWithProduct);
});