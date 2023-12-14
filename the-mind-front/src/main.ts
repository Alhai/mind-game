import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
});

const game = document.getElementById('game') as HTMLElement;
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const option = document.getElementById('options');
const life = document.createElement('div')
      life.setAttribute('id', 'life');
      

form.addEventListener('submit', (e)=>{e.preventDefault()});

const buttonPlay = document.getElementById('play') as HTMLButtonElement;
      buttonPlay.addEventListener('click',()=>{
        socket.emit('start game', input.value);
        form.style.display='none';
      });

const buttonPlayer = document.getElementById('btn-player1') as HTMLButtonElement;
      buttonPlayer.textContent= 'Ready';
socket.emit()


socket.on("disconnect", () => {
  console.log("disconnected");
});
