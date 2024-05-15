const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('path/to/your/cert.pem'),
  key: fs.readFileSync('path/to/your/key.pem')
});

const wss = new WebSocket.Server({ server });

let players = [];

wss.on('connection', function(ws) {
    players.push(ws);

    ws.on('message', function(message) {
        try {
            console.log(`Received: ${message}`);
            const data = JSON.parse(message);
            const toSend = JSON.stringify({ id: data.id, x: data.x, y: data.y, dx: data.dx, dy: data.dy });
            players.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(toSend);
                }
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    ws.on('close', () => {
        players = players.filter(p => p !== ws);
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

server.listen(3000, () => {
    console.log('Server is running on https://localhost:3000');
});
