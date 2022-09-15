import '/style.scss';
import Canvas from './canvas.js';

document.querySelector('#app').innerHTML = `
  <a href="/" class="back-btn">HOME</a>
  <div class="canvas" id="canvas"></div>
`;

const canvasEl = document.getElementById('canvas');
const canvas = new Canvas(canvasEl);


