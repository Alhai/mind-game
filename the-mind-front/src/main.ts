import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
});

const desk = document.getElementById('desk') as HTMLDivElement;
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const option = document.getElementById('options') as HTMLDivElement;
const life = document.createElement('div')
      life.setAttribute('id', 'life');
      

form.addEventListener('submit', (e)=>{e.preventDefault()});

const buttonPlay = document.getElementById('play') as HTMLButtonElement;
      buttonPlay.addEventListener('click',()=>{
        socket.emit('start game', input.value);
        form.remove();
      });

const buttonPlayer = document.querySelectorAll('.btn-player');
      buttonPlayer.forEach((button) => {
        const buttonPlayer = button as HTMLButtonElement;
        buttonPlayer.textContent = 'Ready';
      });

let ready = document.getElementById('btn-player1') as HTMLButtonElement;
      ready.addEventListener('click', ()=>{
        socket.emit('ready', true);
        ready.style.backgroundColor ="green";
        ready.style.color ="white";
      })

socket.on('CardsPick',(hand: number[])=>{
  console.log('hand', hand);
  hand.forEach(((cardValue, i)=>{
    const card = document.createElement('div') as HTMLElement;
          card.setAttribute('class','card');
          card.setAttribute('id', i.toString());
          card.innerText = cardValue.toString()
          card.addEventListener('click', () => {
            socket.emit('playedCard', cardValue);
          })
          card.append(desk);
  }))
})




socket.on("disconnect", () => {
  console.log("disconnected");
});
