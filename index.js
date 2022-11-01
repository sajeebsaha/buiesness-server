const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require("mongodb").ObjectId;

const app=express();
app.use(cors());
app.use(express.json())

//mongo connecting string
//const uri = "mongodb+srv://sajeeb:123456sajeeb@cluster0.wiibo.mongodb.net/?retryWrites=true&w=majority";
const uri="mongodb+srv://sajjeb:1234sajjeb@cluster0.hy6wzxh.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//server home page
app.get("/",(req,res)=>{
    res.send("Hello Open my server");
})




async function run() {
  try {
    await client.connect();
    console.log("connetc")
   //database name
    const database = client.db("buisnessDB");
    //collection name
    const productCollection = database.collection("product");

    //post new product
    app.post("/addproduct",async(req,res)=>{
        //console.log(req.body)
        // const product=req.body.product;
        // const user=req.body.email;
        // console.log(product)
        // console.log(user)
          //const product = req.body
      const result = await productCollection.insertOne(req.body);
         //console.log(result)
          res.json(result)
    })

    //get all products
    app.get("/products", async(req,res)=>{
        const cursor = productCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
    })

    //get single Products
    app.get("/product/:id", async (req,res)=>{
       //console.log(req.params.id)
       // const result = await productCollection.findOne({id:req.params.id})
       const result = await productCollection.findOne({product_name:req.params.id})
        res.send(result)
    })

    app.get("/products/:id", async (req,res)=>{
       // console.log(req.params.id)
        const result = await productCollection.findOne({ _id:ObjectId(req.params.id) })
      // const result = await productCollection.findOne({product_name:req.params.id})
        res.send(result)
        //console.log(result)
    })
    //delete product
    app.delete("/product/:id", async (req,res)=>{
        //console.log(req.params.id)
        const result = await productCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.send(result);
    })

    //get data by email
    app.get('/product/my/:email', async (req,res)=>{
        console.log(req.params.email)
        //console.log(req.params.name)

         const cursor = await productCollection.find({email:req.params.email})
         const result = await cursor.toArray()
         res.send(result)
         //console.log(result)
    })
//data update
    app.put("/product/:id", async(req,res)=>{
        const product = req.body;
       // console.log(product)
        console.log(req.params.id)
            const filter = { _id:ObjectId(req.params.id) };
            const options = { upsert: true };
            
            const updateDoc = { $set: {
                product_name:req.body.product_name,
                product_category:req.body.product_category,
                product_price: req.body.product_price

            } };
            const result = await productCollection.updateOne(filter, updateDoc,options);
            // console.log(result)
            res.send(result)

    })

   
    console.log("database connected");
  } finally {
   
  }
}
run().catch(console.dir);




//server port
app.listen(5000,()=>{
    console.log("server starts");
})