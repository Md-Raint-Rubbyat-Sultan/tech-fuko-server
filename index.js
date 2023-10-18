const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mongodb url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m81o4rz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // db and collections
        const techFukoDb = client.db("techfukodb");
        const brandsCollection = techFukoDb.collection("brands");
        const productsCollection = techFukoDb.collection("products");

        // get data
        app.get('/brands', async (req, res) => {
            const query = {};
            const result = await brandsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        // post data
        app.post('/products', async (req, res) => {
            const productInfo = req.body;
            const result = await productsCollection.insertOne(productInfo);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

// api making
app.get("/", (req, res) => {
    res.send("The api is ready to serve the dish!");
});

// port listener
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});