const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//

app.use(cors());
app.use(express.json())

//WebApp
//jyRrhcFbcouK8aiI


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stvj7tw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // await client.connect();

    const productCollection = client.db('WebApp').collection('products')
    const cartCollection = client.db('WebApp').collection('carts')


    //


    app.get('/products',async(req,res) => {

      const page = parseInt(req.query.page);

      const size = parseInt(req.query.size);

     console.log('pagination',page,size);

        const result = await productCollection.find()

        .skip(page * size)
        .limit(size)
        .toArray();
        res.send(result);
    })
    app.get('/productsCount',async(req,res) => {

      const count = await productCollection.estimatedDocumentCount();

      res.send({count})

    })

    app.get("/carts",async(req,res) => {
      const result = await cartCollection.find().toArray()
      res.send(result)
    })

    app.post('/carts',async(req,res) => {

      const carts = req.body;
      const result = await cartCollection.insertOne(carts);
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res) => {

      const id = req.params.id;
      const query  = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
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




app.get('/',(req,res) => {
    res.send('Chair is running')
})

app.listen(port,() => {
    console.log(`chair is running port,${port}`)
})