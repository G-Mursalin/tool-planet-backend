const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.njw5u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Database Operations
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("tool_planet").collection("products");

    // Get all products or particular number of products from database
    app.get("/products", async (req, res) => {
      const dataSize = parseInt(req.query.size);
      if (dataSize) {
        const result = await productCollection
          .find()
          .skip(0)
          .limit(dataSize)
          .toArray();
        res.send(result);
      } else {
        const result = await productCollection.find().toArray();
        res.send(result);
      }
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// Base API
app.get("/", (req, res) => {
  res.send("Tool Planet Server Running");
});

app.listen(port, () => {
  console.log(`Tool Planet listening on port ${port}`);
});
