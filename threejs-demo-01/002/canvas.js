import {CircleGeometry,Group,Mesh,RawShaderMaterial,DoubleSide} from 'three';
import ThreeBase from './threeBase';

import fragmentShader from './glsl/frag.glsl';
import vertexShader from './glsl/vert.glsl';

export default class Canvas extends ThreeBase {
    constructor(canvasEl) {        
        super(canvasEl); 
        
        
        this.cubeState = {
            layerNumber: 20,
            radius: window.innerHeight / 5,
            opacity: .1,
            color1: {r:1,g:0,b:0},
            color2: {r:0,g:0,b:2},
        }

        this.cubes = [];        

        if(this.debug) {
            this.guiCubeBase = this.gui.addFolder('CubeBase')
            this.guiCubeBase
                .add(this.cubeState,'layerNumber')
                .onFinishChange(() => {
                        this.cubes.forEach( cube => {                            
                            cube.removeFromParent();
                            cube = null;
                        })
                        this.cube = [];
                        this.createCube();
                });
            this.guiCubeBase
                .add(this.cubeState,'radius')
                .onFinishChange(() => {
                    this.cubes.forEach( cube => {                            
                        cube.removeFromParent();
                        cube = null;
                    })
                    this.cube = [];
                    this.createCube();
                });     
            this.guiCubeBase
                .add(this.cubeState,'opacity')
                .onFinishChange((opacity) => {
                    this.cubes.forEach(cube => {
                        cube.children.forEach(layer => {
                            layer.material.uniforms.opacity.value = opacity;
                        })
                    })
                })     
            this.guiCubeBase
                .addColor(this.cubeState,'color1')
                .onChange((color) => {
                    console.log(color);
                    this.cubes.forEach(cube => {
                        cube.children.forEach(layer => {
                            layer.material.uniforms.color1.value = {...color};
                        })
                    })                    
                })
            this.guiCubeBase
                .addColor(this.cubeState,'color2')
                .onChange((color) => {
                    console.log(color);
                    this.cubes.forEach(cube => {
                        cube.children.forEach(layer => {
                            layer.material.uniforms.color2.value = {...color};
                        })
                    })                    
                })
        }

        this.createMesh();
        this.startAnim();
        
    }
    createCube() {
        const geometry = new CircleGeometry(1,Math.floor(this.cubeState.radius / 4));
        const materilal = new RawShaderMaterial({
            uniforms: {                
                time: { value: 0 },
                scrollY: {value:0},
                opacity: {value:this.cubeState.opacity},
                color1: {value:{...this.cubeState.color1}},
                color2: {value:{...this.cubeState.color2}},                
            },        
            color: 0xffffff,    
            transparent: true,
            opacity: this.cubeState.opacity,
            vertexShader,            
            fragmentShader,          
            side: DoubleSide,
        });
        const cube = new Group();

        const layerNumber = this.cubeState.layerNumber;
        const radius = this.cubeState.radius;
        const layerSpace = radius * 2 / layerNumber;
        for(let i = 0; i <= layerNumber; i++) {            
            const size = this.cubeState.radius * Math.sin(Math.acos(Math.abs(i / layerNumber * 2 - 1)));
            const postion_z = layerSpace * i - radius;
            const layer = new Mesh(geometry,materilal.clone());
            layer.material.uniforms.layerProgress = {
                value: i / layerNumber
            }

            layer.scale.set(size,size,1);       
            layer.position.z = postion_z;
            cube.add(layer);                 
        }
        this.cubes.push(cube);
        this.scene.add(cube);        
    }
    createMesh() {
        this.createCube();

    }
    update() {
        this.cubes.forEach( cube => {
            cube.rotation.x = Math.PI / 5;        
            cube.rotation.z = Math.PI / 4 + this.state.currentTime;
            cube.rotation.y = this.state.currentTime        
            // cube.materilal.uniforms.opacity.value = this.cubeState.opacity;
        });        
    }    
    resizeEvent() {

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