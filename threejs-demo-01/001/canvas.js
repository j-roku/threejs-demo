import * as THREE from 'three';
import fragmentShader from './glsl/frag.glsl';
import vertexShader from './glsl/vert.glsl';

export class Canvas {

    constructor() {        
        this.canvasEl = document.getElementById('canvas');
        if(!this.canvasEl) return;
        this.state = {
            isPush: false,
            mousePosition: {x:0,y:0}
        }
        this.stokerList = [];
        this.init();
    }

    init() {        
        this.setup();
        this.setupEvent();
        this.createMesh();        
        this.startAnime();        
    }    

    setup() {
        this.scene = new THREE.Scene();

        const fov = 45;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const fovRad = (fov/2) * (Math.PI / 180);
        const dist = h / 2 / Math.tan(fovRad);    
        this.camera = new THREE.PerspectiveCamera(fov,w / h,0.1,dist * 2);        
        this.camera.position.z = dist;   

        this.renderer = new THREE.WebGL1Renderer({
            alpha: true,
        });
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.canvasEl.appendChild(this.renderer.domElement);
    }

    setupEvent() {
        window.addEventListener('mousedown', e => {
            this.state.isPush = true;
        });
        window.addEventListener('mouseup', e => {
            this.state.isPush = false;
        });
        window.addEventListener('pointermove', e => {
            this.state.mousePosition.x = e.clientX;
            this.state.mousePosition.y = e.clientY;
        });
        window.addEventListener('resize', e => {
            this.resizeEvent();       
        })        
    }

    createMesh() {                    
        const cubeRadius = 600;
        const faceNum = 30;
        const perLength = cubeRadius / faceNum;
        this.sphere = new THREE.Group();
        const mat = new THREE.RawShaderMaterial({            
            uniforms: {                
                time: { value: 0 },
                scrollY: {value:0},
            },        
            color: 0xffffff,    
            transparent: true,
            opacity: 0.1,
            vertexShader,            
            fragmentShader,          
            side: THREE.DoubleSide,  
        });        
        for(let i = 0; i <= faceNum; i++) {            
            const _z = perLength * i - cubeRadius / 2;                                 
            const _size = Math.sin(Math.acos(_z / (cubeRadius / 2 + 1) + 0.0001)) * cubeRadius / 2;                        
            const geo = new THREE.CircleGeometry(_size,cubeRadius * 2);
            const circle = new THREE.Mesh(geo,mat);            
            circle.position.z = _z;            
            this.sphere.add(circle);            
        }
        this.scene.add(this.sphere);

        this.camera.position.x = 1000;
        this.camera.position.z = 0;
        this.camera.lookAt(0,0,0);
    }

    update() {
        const duration = Date.now() - this.startTime; //　経過時間
        const speed = 8; //　追従スピード           

        this.sphere.rotation.y = duration / 2000;
        this.sphere.rotation.x = duration / 2000;

        this.sphere.children.forEach(item => {
            item.material.uniforms.time.value = duration / 500;
            
        });
                
    }
    
    startAnime() {        
        this.startTime = Date.now();
        const frame = () => {            
            this.update();
            this.renderer.render(this.scene,this.camera);            
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