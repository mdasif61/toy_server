const express=require('express')
const app=express()
const port=process.env.PORT || 5000;
const cors=require('cors');
require('dotenv').config()

app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Sports_Special Server Is Running')
})

// jyVhpcLhmhqTsNEA
// sports_toys

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kuomool.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const toyCollection=client.db('all_toys').collection('toys');

    app.get('/alltoys',async(req,res)=>{
      const getToys=await toyCollection.find().toArray();
      res.send(getToys)
    })

    app.get('/mytoys',async(req,res)=>{
      let query={}
      if(req.query?.email){
        query={email:req.query.email}
      }
      const myToys=await toyCollection.find(query).toArray()
      console.log(req.query)
      res.send(myToys)
    })

    app.post('/addToy',async(req,res)=>{
        const toyInfo=req.body
        console.log(toyInfo)
        const result=await toyCollection.insertOne(toyInfo);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('server running port: ', port)
})