import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg: string) => {
    console.log('message: ' + msg);
    // envoyer à tout le monde, moi compris
    // io.emit('fghfhgfh', msg) 

    socket.broadcast.emit('fghfhgfh', msg)
    // envoye le message à tout le monde appart moi 
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});