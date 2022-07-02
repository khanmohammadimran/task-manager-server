const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.63ypc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const taskCollection = client.db('task_manager').collection('addtask');

        //Show all task
        app.get("/task", async (req, res) => {
            const cursor = await taskCollection.find({}).toArray();
            res.send(cursor);
        });

        app.get("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        // Post a task
        app.post("/task", async (req, res) => {
            const data = req.body;
            console.log(data)
            const cursor = await taskCollection.insertOne(data);
            res.send(cursor);
        });

        // Update a task
        app.put("/task/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            };
            const cursor = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(cursor);
        });

        //Delete a task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Task Manager!')
})

app.listen(port, () => {
    console.log(`Task listening on port ${port}`)
})