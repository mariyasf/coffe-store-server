const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middelware
app.use(cors());
app.use(express.json());

// nYLhyx23WZXueHtD
// coffeeMaster

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfacken.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeDB').collection('coffee')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedCoffee = req.body;

            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, option);
            res.send(result);
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(queary);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log('NewCoffee: ', newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const queary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(queary);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Coffee making server is running");
})

app.listen(port, () => {
    console.log(`Coffee making server is running on port: ${port}`)
})