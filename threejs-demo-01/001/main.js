import '/style.scss';
import {Canvas} from './canvas.js';

document.querySelector('#app').innerHTML = `
  <a href="/" class="back-btn">HOME</a>
  <div id="canvas"></div>
`;

const canvas = new Canvas();


