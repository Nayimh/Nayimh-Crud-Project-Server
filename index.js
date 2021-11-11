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
        
        const exploreCollection = database.collection('exploreCars');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('Orders');
        const usersCollection = database.collection('users');
       

        // explore cars
        // get cars api
        app.get("/exploreCars", async (req, res) => {
            const cursor =  exploreCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

        // get single card api
            
        app.get("/exploreCars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await exploreCollection.findOne(query);
            res.send(car);
        });

        // post car api
        app.post("/exploreCars", async (req, res) => {
            const car = req.body;
            const result = await exploreCollection.insertOne(car);
            res.json(result);
        })

        // review cars
         // GET REVIEWS - API
         app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // post review to ui
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

            
            // order cars
      
          // POST ORDERS - API
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });

        // get all orders
        app.get("/orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })
        
          // Orders API with Email - GET
    app.get("/orders/:email", async (req, res) => {
        const email = req.params.email;
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        const customerOrder = orders.filter((mail) => mail.email === email);
        res.send(customerOrder);
    });
        
     // Delete Specific Order API
     app.delete("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const deleteOrder = await orderCollection.deleteOne(query);
        res.json(deleteOrder);
      });
                // user collection api start
        // post user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
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

