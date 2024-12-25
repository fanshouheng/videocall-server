const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ 
    port: PORT,
    clientTracking: true
});

console.log(`Starting WebSocket server on port ${PORT}`);

let clients = new Map();

wss.on('connection', (ws, req) => {
    console.log('New client connected');
    
    const clientId = clients.size + 1;
    clients.set(clientId, ws);
    
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to server',
        clientId: clientId
    }));

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        clients.forEach((client, id) => {
            if (id !== clientId && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        clients.delete(clientId);
        console.log('Client disconnected, remaining:', clients.size);
    });
});
