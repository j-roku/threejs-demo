import {BoxGeometry,Mesh,MeshBasicMaterial} from 'three';
import ThreeBase from './threeBase';

export default class Canvas extends ThreeBase {
    constructor(canvasEl) {        
        super(canvasEl);        
        this.createMesh();
        this.startAnim();
        
    }
    createMesh() {
        const geo = new BoxGeometry(100,100,100);
        const material = new MeshBasicMaterial({color:0xffffff});
        this.box = new Mesh(geo,material);
        this.scene.add(this.box);        
    }
    resizeEvent() {

    }
    update() {
        
        this.box.rotation.x = this.state.currentTime;
    }

    // アニメーションの管理
    startAnim() {
        this.state.startTime = Date.now();
        this.state.currentTime = Date.now();
        this.state.isStart = true;

        // 
        this.resizeEvent();
        this.resizeScene();        
        this.updateScene();
        this.update();
        // 

        const frame = () => {
            requestAnimationFrame(frame);            
            if(this.isCheckResize()) {
                this.resizeEvent();
                this.resizeScene(); // ThreeJS側のリサイズイベント
            }
            this.updateScene();
            this.update();
            // render
            this.render();
        };
        frame();
    } 
} 