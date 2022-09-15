import { Scene,PerspectiveCamera,WebGL1Renderer,AxesHelper} from 'three';
import GUI from 'lil-gui';
export default class ThreeBase {

    constructor(el) {            
        this.el = el;        
        this.debug = true;
        if(!this.el) return;

        this.state = {
            isStart: false,
            startTime: null,
            currentTime: null,
            width: null,
            height: null,
            prevResizeCheck: Date.now(),
        }        

        
        if(this.debug) {
            this.gui = new GUI();                       
        }

        this.setup();
        this.resizeScene();
    }    

    setup() {
        this.scene = new Scene();

        const rect = this.el.getBoundingClientRect();
        this.state.width = rect.width;
        this.state.height = rect.height;
        
        const w = this.state.width;
        const h = this.state.height;
        const fov = 60;
        const fovRad = (fov/2) * (Math.PI / 180);        
        const dist = h / 2 / Math.tan(fovRad);
        this.camera = new PerspectiveCamera(fov,w / h,0.1,dist * 2);
        this.camera.position.z = dist;        

        this.renderer = new WebGL1Renderer({
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,            
        });                        

        this.renderer.setSize(window.innerWidth,window.outerHeight);
        this.renderer.setClearColor(0x000000,0);

        this.el.appendChild(this.renderer.domElement);   
        
        
        if(this.debug) {
            this.scene.add(new AxesHelper(Math.min(this.state.width,this.state.height) / 4))
        }        
    }
    isCheckResize() {
        const current = Date.now();        
        if((current - this.state.prevResizeCheck) < 700) return false;
        this.state.prevResizeCheck = current;
        const rect = this.el.getBoundingClientRect();
        if(this.state.width !== rect.width || this.state.height !== rect.height) {
            return true;
        }               
        return false; 
    }

    resizeScene() {
        const rect = this.el.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        this.state.width = w;
        this.state.height = h;

        this.renderer.setSize(w,h);
        
        this.camera.aspect = w / h;

        const fovRad = (this.camera.fov/2) * (Math.PI / 180);        
        this.camera.position.z = h / 2 / Math.tan(fovRad);        
        const deviceRatio = Math.min(window.devicePixelRatio,2);
        this.renderer.setPixelRatio(deviceRatio);
        this.camera.updateProjectionMatrix();
    }

    updateScene() {
        this.state.currentTime = (Date.now() - this.state.startTime) / 1000;        
    }

    render() {
        this.renderer.render(this.scene,this.camera);
    }

}