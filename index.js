const express = require('express');

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express();

// port number 
const port = process.env.PORT || 5000;

// Middleware 
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/',(req, res)=>{
    res.send("connection is establish");
})


const uri = "mongodb+srv://mostofakamal:mk6683mk*@cluster0.zwqcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const productCollection = client.db("carewarehouse").collection("products");
//   // perform actions on the collection object
//   console.log("mongodb Connection ok");
 
// });


const run = async()=>{


  try{

    await client.connect();

    const database =  client.db('carewarehouse');

    // get all products 
    app.get('/allProducts', async(req, res)=>{

      const productCollection =  database.collection('products');
      const result = await productCollection.find({}).toArray();
  
      res.send(result);
      console.log("result",result);

    });


    // add products

    app.post('/add-products',async(req, res)=>{

      // create object 

      const data = req.body;

     const result = await database.collection("products").insertOne(data);


      console.log("result ", result.insertedId);

      res.send(result);


      // {
      //   productName:"abcd"
      // ,ProductDescription:'bbcdd', 
      // Price: 500
      // ,qty:20,
      //  supplier:'aaaa'}
      

      
    });


    // delete Products 

    app.delete('/product/:id', async(req, res)=>{
      const _id = req.params.id;
      const query = {_id:objectId(_id)};
      const result = await database.collection('products');
      const rr = await result.deleteOne(query);
      res.send(rr);


    })

    // single items 

    app.get('/singleItem/:id', async(req, res)=>{

      const id= req.params.id;
      const query = {_id:objectId(id)};
      const result = await database.collection('products');
      const rr = await result.findOne(query);
      res.send(rr);

      
    })
 
    // update  products

    app.put('/product/:id',async(req, res)=>{

      const id = req.params.id;
      const products = req.body;
      const updateColl = database.collection('products');
      const filter = { _id: objectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          qty:products.qty,
          price: products.price,
          productName: products.productName,
          productDescription: products.productDescription,
          supplier: products.supplier,
          imageUrl: products.imageUrl,
          
        }
        
      };

      console.log("prouct Object",products)
      const result = await updateColl.updateOne(filter, updateDoc, options);

      res.send(result);
      console.log(result);

    });

    // ReStock items  

    app.put('/restock/:id',async(req, res)=>{

      const id = req.params.id;
      const products = req.body;
      const restock = database.collection('products');
      const filter = { _id: objectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          qty:products.qty
          
        }
        
      };

     // console.log("prouct Object",products)
      const result = await restock.updateOne(filter, updateDoc, options);

      res.send(result);
      console.log(result);

    });


    // item delivered 

    app.put('/item-delivered/:id',async(req, res)=>{
     const id = req.params.id;
      const products = req.body;
      const itemDeliverUpdate = database.collection('products');
      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          qty:parseInt(products.qty) - 1
          
        }
        
      };

     // console.log("prouct Object",products)
      const result = await itemDeliverUpdate.updateOne(filter, updateDoc, options);

      res.send(result);
      //console.log(result);
    })
    

  } finally{

  }


}



run().catch(console.dir);





app.listen(port, ()=>{
    console.log("Server is running Now");
});





