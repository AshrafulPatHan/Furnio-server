require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASWORD}@cluster0.zxihh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let User; // globally declare
let img_collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('Furniro');
    img_collection = db.collection('Images');
    User = db.collection('user');

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}
connectDB();

// ---------------- Routes ----------------

app.get('/', (req, res) => {
  res.send('The Server is running!');
});

// Static image json
const image_json = [
  { "id": "1", "Img": "https://i.ibb.co.com/Zz2YkWKp/Images-2.png" },
  { "id": "2", "Img": "https://i.ibb.co.com/QFKDhKHv/Images-1.png" },
  { "id": "3", "Img": "https://i.ibb.co.com/qYGhwcDJ/Images.png" },
  { "id": "4", "Img": "https://i.ibb.co.com/B270hzg1/image-8.png" },
  { "id": "5", "Img": "https://i.ibb.co.com/kszZ9X83/image-6.png" },
  { "id": "6", "Img": "https://i.ibb.co.com/dJB3wm1f/image-4.png" },
  { "id": "7", "Img": "https://i.ibb.co.com/tMw44yTw/image-1.png" },
  { "id": "8", "Img": "https://i.ibb.co.com/fz6bc4X9/bed-3804251-1920.jpg" }
];
app.get('/image', (req, res) => {
  res.send(image_json);
});

// ------------ Register route ------------
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.insertOne({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: "✅ User Registered!" });
  } catch (error) {
    res.status(500).send("❌ Registration Error: " + error.message);
  }
});

// ------------ Login route ------------
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("❌ User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send("❌ Invalid credentials!");

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send("❌ Login Error: " + error.message);
  }
});

// ----------- Server Start ------------
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
