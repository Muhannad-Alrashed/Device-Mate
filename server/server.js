// Libraries
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const socketIo = require('socket.io');
require('dotenv').config();

// Modules
const verifyToken = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/auth');
const createSocket = require('./socket');
const connRoutes = require('./routes/conn');
const filesRoutes = require('./routes/files');
const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
const historyRoutes = require('./routes/history');
const globalRoutes = require('./routes/global');

// Settings
const PORT = process.env.SERVER_PORT || 3001;
const corsOptions = {
  origin: PORT === 3001
    ? "http://localhost:3000"                    // Development
    : "https://devicemate.netlify.app",          // Production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Server Setup
const app = express();
const server = http.createServer(app);
// Socket Setup
const io = socketIo(server, {
  transports: ['websocket', 'polling'],
  cors: corsOptions,
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));

// APIs
createSocket(io);                      // Socket Creation
app.use('/dashboard', verifyToken);    // Dashboard Authorization
app.use('/auth', authRoutes);          // Authentication Routes
app.use('/conn', connRoutes);          // Connection Routes
app.use('/files', filesRoutes);        // Transfer Routes
app.use('/chat', chatRoutes);          // Chat Routes
app.use('/profile', profileRoutes);    // Profile Routes
app.use('/history', historyRoutes);    // History Routes
app.use('/global', globalRoutes);      // Global Routes

// Test API
app.use('/', (req, res) => {
  res.send("Welcome to APIs URL");
})

// Start Server
const localHost = `http://localhost:${PORT}`;
const cloudHost = process.env.SERVER_HOST
server.listen(PORT, () => {
  console.log(`Server is connected and running on ${PORT === 3001 ? localHost : cloudHost}`);
});
