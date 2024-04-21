const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());

//mongodb

const uri =
   "mongodb+srv://noortusharkhan:ChEzrwzmrjHO93kU@cluster0.j7c4zww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      // Database and Collection
      const database = client.db("usersDB");
      const userCollection = database.collection("users");

      // GET API for Users
      app.get("/users", async (req, res) => {
         // how to get the data?
         const cursor = userCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });

      // POST API
      app.post("/users", async (req, res) => {
         const user = req.body;
         console.log("new user is here :", user);
         const result = await userCollection.insertOne(user);
         res.send(result);
      });

      // Delete API - Deleting single user from database
      app.delete("/users/:id", async (req, res) => {
         // getting which id to delete
         const id = req.params.id;
         console.log(`delete this id from db: ${id}`);

         // query (field name in database: value we seek)

         const query = { _id: new ObjectId(id) };

         const result = await userCollection.deleteOne(query);
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.log);

//routes and API

app.get("/", (req, res) => {
   res.send("Simple Crud Server is working fine");
});

app.listen(port, () => {
   console.log(`app running at port: ${port}`);
});
