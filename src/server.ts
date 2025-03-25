import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';
import { authController } from './controllers/authController';
import { meetingController } from './controllers/meetingController';
import { WebSocketService } from './services/WebSocketService';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authController);
app.use('/api/meetings', meetingController);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist/client')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/client/index.html'));
    });
}

// Initialize WebSocket
new WebSocketService(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});