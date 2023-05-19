const express=require('express')
const app=express()
const port=process.env.PORT || 5000;
const cors=require('cors');
require('dotenv').config()

app.use(cors({
  origin:'*'
}))
app.use(express.json());



app.get('/',(req,res)=>{
    res.send('Sports_Special Server Is Running')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

     client.connect();

    const toyCollection=client.db('all_toys').collection('toys');

    app.get('/alltoys',async(req,res)=>{
      const limit=parseInt(req.query.limit) || 4
      const getToys=await toyCollection.find().limit(limit).toArray();
      res.send(getToys)
    })

    app.get('/uniqueToy/:id',async(req,res)=>{
      const toyId=req.params.id;
      const query={_id:new ObjectId(toyId)};
      const result=await toyCollection.findOne(query);
      res.send(result)
    })

    app.get('/gellery',async(req,res)=>{
      const result=await toyCollection.find().toArray();
      res.send(result)
    })
    
    app.get('/activeCategoys/:category',async(req,res)=>{
      const activeCategoy=req.params.category;
      if(req.params.category==='Ball Games' || req.params.category==='Outdoor Adventures' || req.params.category==='Team Sports'){
        const query={category:req.params.category};
        const result=await toyCollection.find(query).toArray()
        res.send(result)
      }else if(req.params.category==='All'){
        const result=await toyCollection.find().toArray()
        res.send(result)
      }
    })

    const key={name:1}
    const indexName={name:'toyName'}
    const result=await toyCollection.createIndex(key,indexName)
    app.get('/searchName/:toy',async(req,res)=>{
      const toyName=req.params.toy;
      const result=await toyCollection.find({
        $or:[
          {name:{$regex:toyName, $options:'i'}}
        ]
      }).toArray()
      res.send(result)
    })

    app.get('/totalToy',async(req,res)=>{
      const totalToys=await toyCollection.estimatedDocumentCount();
      res.send({totalToy:totalToys})
    })

    app.get('/mytoys',async(req,res)=>{
      let query={}
      if(req.query?.email){
        query={sellerEmail:req.query.email}
      }
      const myToys=await toyCollection.find(query).toArray()
      // console.log(req.query)
      res.send(myToys)
    })

    app.post('/addToy',async(req,res)=>{
        const toyInfo=req.body
        console.log(toyInfo)
        const result=await toyCollection.insertOne(toyInfo);
        res.send(result)
    });

    app.delete('/mytoys/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await toyCollection.deleteOne(query);
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