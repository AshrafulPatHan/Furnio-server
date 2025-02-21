require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3000

app.get('/', (req, res) => {
  res.send('The Server is runing!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASWORD}@cluster0.zxihh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // ----------this is strting point

    // Database and collections
    const main = client.db('Furniro');
    const img_colection = main.collection('Images');


    
    // -----------last point
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




// Furniro
// 7sL3jqGeLVMyM8Qe
// nodemon index.js