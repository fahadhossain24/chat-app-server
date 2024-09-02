// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Message = require('./app/models/message');
const User = require('./app/models/user');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());


connectDB();

app.get('/', (req, res) => {
    res.send("working")
})


// Define the /register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Implement your registration logic here
    if (username && password) {
      // Simulate successful registration
      res.status(201).json({ message: 'User registered successfully!' });
    } else {
      res.status(400).json({ message: 'Username and password are required' });
    }
  });
  
  // Define the /login route
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Basic authentication logic for demonstration
    if (username === 'test' && password === 'password') {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userId) => {
    // Set user as online
    await User.findByIdAndUpdate(userId, { online: true });
    socket.userId = userId;

    // Fetch and send past messages
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    });
    socket.emit('past messages', messages);
  });

  socket.on('chat message', async (msg) => {
    const message = new Message(msg);
    await message.save();
    io.emit('chat message', msg);
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { online: false });
    }
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
