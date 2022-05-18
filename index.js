const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


//connect with mongodb

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.qmnm6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// create an async function
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection("tasks");
        //get api
        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = taskCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });
        //post api
        app.post('/tasks', async (req, res) => {
            const newTasks = req.body;
            const result = await taskCollection.insertOne(newTasks);
            res.send(result);
        });

        //delete api
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })
        //put api
        app.put('/tasks/:id', async (req, res) => {
            const updatedTask = req.body;
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: updatedTask
            }
            const result = await taskCollection.updateOne(query, updatedDoc, option)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)


//root api 
app.get('/', (req, res) => {
    res.send('yep!')
})

app.listen(port, () => {
    console.log('chintanai dowracci');
})
