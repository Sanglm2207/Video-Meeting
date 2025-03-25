import WebSocket from 'ws';
import { Server } from 'http';

enum WsMessageType {
    JOIN = 'join',
    OFFER = 'offer',
    ANSWER = 'answer',
    ICE_CANDIDATE = 'ice-candidate',
    TOGGLE_MEDIA = 'toggle-media'
}

export class WebSocketService {
    private wss: WebSocket.Server;
    private connections = new Map<string, WebSocket>();

    constructor(server: Server) {
        this.wss = new WebSocket.Server({ server, path: '/ws' });

        this.wss.on('connection', (ws, req) => {
            const meetingId = req.url?.split('=')[1] || '';
            const userId = req.headers['user-id'] as string;

            if (!meetingId || !userId) {
                ws.close();
                return;
            }

            this.connections.set(userId, ws);
            console.log(`User ${userId} connected to meeting ${meetingId}`);

            ws.on('message', (message) => this.handleMessage(meetingId, userId, message));
            ws.on('close', () => this.handleDisconnect(userId));
        });
    }

    private handleMessage(meetingId: string, userId: string, message: WebSocket.Data) {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case WsMessageType.OFFER:
                case WsMessageType.ANSWER:
                case WsMessageType.ICE_CANDIDATE:
                    this.forwardMessage(data.targetUserId, message);
                    break;
                case WsMessageType.TOGGLE_MEDIA:
                    this.broadcastToMeeting(meetingId, userId, message);
                    break;
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    private forwardMessage(targetUserId: string, message: WebSocket.Data) {
        const targetWs = this.connections.get(targetUserId);
        if (targetWs) {
            targetWs.send(message.toString());
        }
    }

    private broadcastToMeeting(meetingId: string, senderId: string, message: WebSocket.Data) {
        // Implementation would broadcast to all meeting participants
        // except the sender
    }

    private handleDisconnect(userId: string) {
        this.connections.delete(userId);
        console.log(`User ${userId} disconnected`);
    }
}