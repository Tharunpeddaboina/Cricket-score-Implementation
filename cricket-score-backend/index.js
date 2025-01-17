const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const app = express();
const port = 8000;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'], 
}));

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Import routes
const adminRoutes = require('./routes/AdminRoutes');
const userRoutes = require('./routes/UserRoutes');

// Middleware
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Real-time communication with Socket.IO
let score = { runs: 0, wickets: 0 };
let currentOver = [];
let overs = [];

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Send initial data to the connected client
  socket.emit('initialData', { score, currentOver, overs });

  // Listen for updates from Admin
  socket.on('updateScore', (data) => {
    score = data.score;
    currentOver = data.currentOver;
    overs = data.overs;

    // Broadcast updates to all connected clients
    io.emit('scoreUpdate', { score, currentOver, overs });
  });

  // Handle the runScored event and emit the animation based on the runs scored
  socket.on('runScored', (runs) => {
    console.log('Run scored:', runs);
    if (runs === 1) {
      io.emit('animation', 'run1');
    } else if (runs === 2) {
      io.emit('animation', 'run2');
    } else if (runs === 3) {
      io.emit('animation', 'run3');
    } else if (runs === 4) {
      io.emit('animation', 'run4');
    } else if (runs === 6) {
      io.emit('animation', 'run6');
    }
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
