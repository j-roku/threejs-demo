import '/style.scss';
import {Canvas} from './canvas.js';

document.querySelector('#app').innerHTML = `  
  <div id="canvas"></div>  
  <div class="page">
    <div class="page__content">
      <h1 class="page__siteTitle">three.js demo</h1>
    </div>
  </div>
`;

const canvas = new Canvas();


