const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId;
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sz6ue.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db(process.env.DB_NAME);
    const bikesCollection = database.collection("bikes");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");


    // Posting new User
    app.post("/users", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      res.json(result);
    });

    // getting current user 
    app.get("/users/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await usersCollection.findOne(query)
      res.send(result);
    });

    // get all bikes 
    app.get("/bikes", async (req, res) => {
      const result = await bikesCollection.find({}).toArray()
      res.send(result);
    })

    // get single bike
    app.get("/bikes/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await bikesCollection.findOne(query)
      res.send(result);
    })

    // get all Orders
    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray()
      res.send(result);
    })

    // get user Orders
    app.get("/orders/:email", async (req, res) => {
      const query = { email: req.params.email }
      const result = await ordersCollection.find(query).toArray()
      res.send(result);
    })


    // new Order
    app.post("/orders", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    });


    // delete order 
    app.delete("/orders/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });


    // new review
    app.post("/reviews", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      res.json(result);
    });

    // get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find({}).sort({ _id: -1 }).toArray();
      res.send(result);
    });

    // new product
    app.post("/bikes", async (req, res) => {
      const result = await bikesCollection.insertOne(req.body);
      res.json(result);
    });


    // make admin 
    app.put("/users/admin", async (req, res) => {
      const filter = { email: req.body.email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);

    });

    // delete product
    app.delete("/bikes/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await bikesCollection.deleteOne(query);
      res.json(result);
    });



    // update room status
    app.patch("/orders/status/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const updateDoc = {
        $set: req.body,
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

  }
  finally { }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
