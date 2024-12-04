// Libraries
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const socketIo = require('socket.io');
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
// Server Setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: "http://localhost:3000",
    methods: ["*"],
    credentials: true
  }
});
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// APIs
createSocket(io);                           // Socket Creation
app.use('/server/dashboard', verifyToken);  // Dashboard Authorization
app.use('/server/auth', authRoutes);        // Authentication Routes
app.use('/server/conn', connRoutes);        // Connection Routes
app.use('/server/files', filesRoutes);      // Transfer Routes
app.use('/server/chat', chatRoutes);        // Chat Routes
app.use('/server/profile', profileRoutes);  // Profile Routes
app.use('/server/history', historyRoutes);  // History Routes
app.use('/server/global', globalRoutes);    // Global Routes

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is connected and running on http://localhost:${PORT}`);
});
