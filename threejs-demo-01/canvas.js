import * as THREE from 'three';
import fragmentShader from './glsl/frag.glsl';
import vertexShader from './glsl/vert.glsl';

export class Canvas {

    constructor() {        
        this.canvasEl = document.getElementById('canvas');
        if(!this.canvasEl) return;
        this.state = {
            isPush: false,
            mousePosition: {x:0,y:0},
            vMousePosition: {x:0,y:0},
            acceleration: {x:0,y:0},
            speed: {x:0,y:0},
            cameraDist: 0,
            scrollY: 0,
            virtualY: 0,            
            prevPointer: {x:0,y:0}
        }
        this.item = null;
        this.init();
    }

    init() {        
        this.setup();
        this.setupEvent();
        this.createMesh();        
        this.startAnime();        
    }    

    async setup() {
        this.scene = new THREE.Scene();

        const fov = 60;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const fovRad = (fov/2) * (Math.PI / 180);
        this.state.cameraDist = h / 2 / Math.tan(fovRad);               
        this.camera = new THREE.OrthographicCamera(-w/2,w/2,h/2,-h/2,0.1,this.state.cameraDist * 1.1);
        this.camera.position.z = this.state.cameraDist;   

        this.renderer = new THREE.WebGL1Renderer();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.canvasEl.appendChild(this.renderer.domElement);

        const fontface = new FontFace('Lment','url("/fonts/Lment.otf")');        
        await fontface.load();
        document.fonts.add(fontface);
    }

    setupEvent() {          
        window.addEventListener('scroll', e => {            
            this.state.scrollY = window.scrollY;                        
        });
        window.addEventListener('mousedown', e => {
            this.state.isPush = true;
        });
        window.addEventListener('mouseup', e => {
            this.state.isPush = false;
        });
        window.addEventListener('mousemove', e => {
            this.state.mousePosition.x = e.clientX;
            this.state.mousePosition.y = e.clientY;
        });
        window.addEventListener('resize', e => {
            this.resizeEvent();       
        })                
    }

    createMesh() {
        const size = Math.max(window.innerWidth,window.innerHeight);
        const geometry = new THREE.PlaneGeometry(size,size);
        const material = new THREE.RawShaderMaterial({
            uniforms: {                
                time: { value: 0 },
                scrollY: {value:0},
            },
            vertexShader,            
            fragmentShader,
            transparent: false,
        })
        this.item = new THREE.Mesh(geometry,material);        
        this.scene.add(this.item);
    }

    update() {        
        const duration = (Date.now() - this.startTime) / 1000; //　経過時間                
        this.item.material.uniforms.time.value = duration;
        this.item.material.uniforms.scrollY.value = this.state.virtualY;
    }
    
    startAnime() {        
        this.startTime = Date.now();
        const frame = () => {            
            this.update();
            this.renderer.render(this.scene,this.camera);

            const diff = this.state.scrollY - this.state.virtualY;
            if(Math.abs(diff) > 1) {
                this.state.virtualY += diff * 0.05;
            }
            requestAnimationFrame(frame);
        }                
        frame();
    }

    resizeEvent() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(w,h);

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }
} 