const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfbw0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const database = client.db('medicine');
    const ProductsCollection = database.collection('product');
    const bookingCollection = database.collection('booking');
    const reviewCollection = database.collection('review');
    const adminCollection = database.collection('admin');

    //add product
    app.post('/addProduct', async (req, res) => {
      const product = req.body;
      const result = await ProductsCollection.insertOne(product);
      res.json(result);
    });


    //Make Admin
    app.post('/makeAdmin', async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.insertOne(admin);
      res.json(result);
    });

    // add review
    app.post('/getReview', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // GET product
    app.get('/products', async (req, res) => {
      const cursor = ProductsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // GET Admin
    app.get('/admins', async (req, res) => {
      const cursor = adminCollection.find({});
      const admins = await cursor.toArray();
      res.send(admins);
    });

    //Get Reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // add booking products
    app.post('/bookingProduct', async (req, res) => {
      const bookingProduct = req.body;
      const result = await bookingCollection.insertOne(bookingProduct);

      res.send(result);
      console.log(result);
    });

    //get my booking items
    app.get('/myBooking/:email', async (req, res) => {
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    //get all booking items
    app.get('/allBooking', async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    });

    //delete booking product
    app.delete('/deleteBooking/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.deleteOne({ _id: id });
      res.send(result);
    });


    //delete product
    app.delete('/deleteProduct/:id', async (req, res) => {
      const id = req.params.id;
      const result = await ProductsCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //Shipped product
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
      console.log(id);
      const filter = { _id: id };

      bookingCollection
        .updateOne(filter, {
          $set: {
            status: updatedStatus.status,
          },
        })
        .then(result => {
          res.send(result);
          console.log(result);
        });
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Sunglass server is Runinggggg!');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
