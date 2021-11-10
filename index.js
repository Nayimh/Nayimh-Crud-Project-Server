const express = require('express');

const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cetyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('uniqueCars');
        const carsCollection = database.collection('cars');
        const exploreCollection = database.collection('exploreCars');

        // get cars api
        app.get("/cars", async (req, res) => {
            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
          });

        // get cars api
        app.get("/exploreCars", async (req, res) => {
            const cursor = exploreCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })
        
        

        
        // post cars api
        app.get('/cars', async (req, res)=>{
            const doc = {
                title: "Record of a Shriveled Datum",
                content: "No bytes, no problem. Just insert a document, in MongoDB",
            }
            const result = await carsCollection.insertOne(doc)
            
            // res.json(result, "running");
        })
        
        
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('listning to port', port)
})

// UniquifyCar
// LNR6aj9lLpDKRRFL