const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // db and collections
        const techFukoDb = client.db("techfukodb");
        const brandsCollection = techFukoDb.collection("brands");
        const productsCollection = techFukoDb.collection("products");
        const cartProductCollection = techFukoDb.collection("cart");

        // get data
        app.get('/brands', async (req, res) => {
            const query = {};
            const result = await brandsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/brand-products/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brandName: brand };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/single-products/:id', async (req, res) => {
            const productId = req.params.id;
            const query = { _id: new ObjectId(productId) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        app.get('/cart-products', async (req, res) => {
            const query = {};
            const result = await cartProductCollection.find(query).toArray();
            res.send(result);
        })

        // post data
        app.post('/products', async (req, res) => {
            const productInfo = req.body;
            const result = await productsCollection.insertOne(productInfo);
            res.send(result);
        })

        app.post('/add-to-cart', async (req, res) => {
            const productInfo = req.body;
            const result = await cartProductCollection.insertOne(productInfo);
            res.send(result);
        })

        // update product
        app.put("/single-products/:id", async (req, res) => {
            const productId = req.params.id;
            const { productName, brandName, type, price, details, rate, photo } = req.body;
            const query = { _id: new ObjectId(productId) };
            const options = { upsert: true };
            const update = {
                $set: {
                    productName,
                    brandName,
                    type,
                    price,
                    details,
                    rate,
                    photo
                }
            };
            const result = await productsCollection.updateOne(query, update, options);
            res.send(result);
        })

        // delete data
        app.delete("/cart-products/:id", async (req, res) => {
            const cartId = req.params.id;
            const query = { productId: cartId };
            const result = await cartProductCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })

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