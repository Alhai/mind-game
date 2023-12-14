import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const players: { id: string; name: string; hand: number[] }[] = [];
let currentLevel = 1;
const niveauDeCarte = [[1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]];

// Cartes disponibles dans la pioche (numérotées de 1 à 100)
let deck: number[] = Array.from({ length: 100 }, (_, index) => index + 1);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  players.push({id : socket.id, name : "", hand : []})
  socket.on('start game', (playerName) => { console.log("start game")
    // Vérifie si 2 joueurs ont le même nom
    const existingPlayer = players.find((p) => p.name === playerName);
    if (existingPlayer) {
      console.log('Player with the same name already exists');
      return;
    }

    // Mise à jour du nom du joueur 
    const myPlayerIndex = players.findIndex((p) => p.id === socket.id);
    if (myPlayerIndex !== -1 && !players[myPlayerIndex].name) {
      players[myPlayerIndex].name = playerName;
    }
    console.log("joueur modifié", players)
    // Vérifie si 2 joueurs on un nom remplis et lance la partie si c'est le cas
    const playersWithNames = players.filter((p) => p.name !== "");
    if (playersWithNames.length === 2) {
      io.emit('gameStart');
    }
  });

  socket.on('playCard', (carte) => {
    // io.emit('nouvelle-carte', { player: players[socket.id].name, card: carte });
    verifierOrdreCartes();
  });

  socket.on('nextLevel', () => {
    currentLevel++;
    distribuerCartes();
  });

  socket.on('disconnect', () => {
    const disconnectedPlayer = players.find((p) => p.id === socket.id);
    // Supprime le nom du joueur si il se déconnecte 
    if (disconnectedPlayer) {
      disconnectedPlayer.name = "";
    }
  });
});

function distribuerCartes() {
  const cartesDuNiveau = niveauDeCarte[currentLevel - 1];

  players.forEach(p => {
    p.hand = [];
    for (let i = 0; i < cartesDuNiveau.length; i++) {
      const carteIndex = Math.floor(Math.random() * deck.length);
      p.hand.push(deck[carteIndex]);
      deck = deck.filter((val, i) => i !== carteIndex)
    }
    io.to(p.id).emit('CardsPick')
  });
}

// Créez une copie du paquet pour ne pas modifier l'original
let shuffledDeck = [...deck];

// Fonction pour mélanger le paquet de cartes
function shuffleDeck(deck: number[]): number[] {
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}
function verifierOrdreCartes() {
}

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

