const express = require('express');
const cors = require('cors'); // Use to communicate with frontend
const mongoose = require('mongoose'); // To connect to MongoDB
const userRoute = require('./Routes/userRoute');
const chatRoute = require('./Routes/chatRoute');
const path = require('path');
const multer = require('multer');
const messageRoute = require('./Routes/messageRoute');

const app = express();
require('dotenv').config();

// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: req.file.path });
});

app.get('/', (req, res) => {
  res.send('Welcome to our Chat App API...');
});

// Listen on a specific host and port
// const HOST = '192.168.76.221'; // Listen on all network interfaces
const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Server Running on port: ${port}`);
});
// app.listen(port, HOST, () => {
//   console.log(`Server Running on http://${HOST}:${port}`);
// });

const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {})
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.log('MongoDB connection failed: ', error.message));
