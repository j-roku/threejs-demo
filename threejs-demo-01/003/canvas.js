import {CircleGeometry,Group,Mesh,RawShaderMaterial,DoubleSide} from 'three';
import ThreeBase from './threeBase';
import {gsap,Sine} from 'gsap';

import fragmentShader from './glsl/frag.glsl';
import vertexShader from './glsl/vert.glsl';

export default class Canvas extends ThreeBase {
    constructor(canvasEl) {        
        super(canvasEl);        
        
        this.cubes = new Map();
        this.cubeOptions = new Map();
        this.sceneState = {
            cubeNumber: 1,
            lastcolor1: {r:1,g:0,b:0},
            lastcolor2: {r:1,g:1,b:0},
            lastcolor3: {r:1,g:0,b:1},
        }
        this.state.colorProgress = 0;

        if(this.debug) {
            this.gui
            .addColor(this.sceneState,'lastcolor1')
            .onFinishChange((color) => {
                cube.children.forEach(layer => {
                    layer.material.uniforms.lastcolor1.value = {...color};
                })     
            })   
            this.gui
            .addColor(this.sceneState,'lastcolor2')
            .onFinishChange((color) => {
                cube.children.forEach(layer => {
                    layer.material.uniforms.lastcolor2.value = {...color};
                })     
            })   
            this.gui
            .addColor(this.sceneState,'lastcolor3')
            .onFinishChange((color) => {
                cube.children.forEach(layer => {
                    layer.material.uniforms.lastcolor3.value = {...color};
                })     
            })   
        }

        this.cubeGroup = new Group();
    
        this.createMesh();
        this.event();
        this.startAnim();    
    }
    createCube(name) {     
        let state = this.cubeOptions.get(name);
        const isInit = (!state) ? true : false;
        if(isInit) {
            state = {            
                layerNumber: 25,
                radius: window.innerHeight / 4,
                opacity: .15,
                color1: {r:1,g:0,b:0},
                color2: {r:0,g:1,b:3},
                layerDistortion: 15,
            }
        }       

        this.cubeOptions.set(name,state);

        const geometry = new CircleGeometry(1,Math.floor(state.radius / 4));
        const materilal = new RawShaderMaterial({
            uniforms: {                
                time: { value: 0 },
                scrollY: {value:0},
                opacity: {value:state.opacity},
                color1: {value:{...state.color1}},
                color2: {value:{...state.color2}},
                blend: {value: this.state.colorProgress},
                lastcolor1: {value:this.sceneState.lastcolor1},
                lastcolor2: {value:this.sceneState.lastcolor2},
                lastcolor3: {value:this.sceneState.lastcolor3},
            },        
            color: 0xffffff,    
            transparent: true,
            opacity: state.opacity,
            vertexShader,            
            fragmentShader,          
            side: DoubleSide,
        });
        const cube = new Group();
        console.log('createvubt',name);
        cube.name = name;

        const layerNumber = state.layerNumber;
        const radius = state.radius;
        const layerSpace = radius * 2 / layerNumber;
        for(let i = 0; i <= layerNumber; i++) {            
            const size = state.radius * Math.sin(Math.acos(Math.abs(i / layerNumber * 2 - 1)));
            const postion_z = layerSpace * i - radius;                        
            const layerRotation = ((i / layerNumber) * 2 - 1) * (Math.PI / 180 * state.layerDistortion);
            const diff = Math.sin(Math.abs(layerRotation)) * postion_z;
            const diffZ = diff / Math.tan(Math.abs(layerRotation));                        
            const layer = new Mesh(geometry,materilal.clone());
            
            layer.material.uniforms.layerProgress = {
                value: i / layerNumber
            }

            layer.scale.set(size,size,1);
            layer.rotation.y = Math.abs(layerRotation);      
            layer.rotation.x = Math.abs(layerRotation);                        
            layer.position.z = postion_z - (postion_z - diffZ);
            layer.position.x = diff;
            layer.position.y = -diff
            cube.add(layer);                 
        }
        
        this.cubes.set(name,cube);        

        if(isInit && this.debug) {
            this.addCubeGui(name,state);
        }        

        return cube;
    }
    addCubeGui(name,state) {
        const cubeOption = this.gui.addFolder(name);        
        let cube = this.cubes.get(name);
        cubeOption
            .add(state,'layerNumber')
            .onFinishChange(() => {                    
                cube.removeFromParent();
                this.cubes.delete(name);
                cube = null;
                const new_cube = this.createCube(name);
                this.cubeGroup.add(new_cube);

            });
        cubeOption
            .add(state,'layerDistortion')
            .onChange(() => {                     

                const layerNumber = state.layerNumber;
                const radius = state.radius;
                const layerSpace = radius * 2 / layerNumber;                
                cube.children.forEach((layer,i) => {                                                                                
                    const layerRotation = ((i / layerNumber) * 2 - 1) * (Math.PI / 180 * state.layerDistortion);
                    const postion_z = layerSpace * i - radius;            
                    const diff = Math.sin(Math.abs(layerRotation)) * postion_z;                    
                    const diffZ = diff / Math.tan(Math.abs(layerRotation));          
                    layer.rotation.y = Math.abs(layerRotation);      
                    layer.rotation.x = Math.abs(layerRotation);                        
                    layer.position.x = diff;
                    layer.position.z = postion_z - (postion_z - diffZ);
                    layer.position.y = -diff                                          
                })

            });
        cubeOption
            .add(state,'radius')
            .onFinishChange(() => {
                cube.removeFromParent();
                this.cubes.delete(name);
                cube = null;
                const new_cube = this.createCube(name);
                this.cubeGroup.add(new_cube);        
            });     
        cubeOption
            .add(state,'opacity')
            .onFinishChange((opacity) => {
                cube.children.forEach(layer => {
                    layer.material.uniforms.opacity.value = opacity;
                })
            })     
        cubeOption
            .addColor(state,'color1')
            .onChange((color) => {                
                cube.children.forEach(layer => {
                    layer.material.uniforms.color1.value = {...color};
                })                 
            })
        cubeOption
            .addColor(state,'color2')
            .onChange((color) => {                
                cube.children.forEach(layer => {                    
                    layer.material.uniforms.color2.value = {...color};
                })                
            })        

    }
    createMesh() {
        for(let i = 0; i < this.sceneState.cubeNumber; i++) {
            const name = `cube-${i + 1}`;
            const cube = this.createCube(name);             
            this.cubeGroup.add(cube);
        }        
        this.scene.add(this.cubeGroup)
    }
    update() {
        // let i = 0;
        // this.cubes.forEach( (cube) => {            
        //     cube.rotation.x = this.state.currentTime / 5;
        //     cube.rotation.y = this.state.currentTime / 2;            
        //     i++;      
        // });

        // this.camera.position.set(0,1000,0);
        // this.camera.lookAt(0,0,0);
    }    
    event() {
        document.getElementById('btn-start')?.addEventListener('click', e => {
            const duration = 3;            
            gsap.to(this.state, {
                colorProgress: 1,
                duration: duration,
                ease: Sine.easeInOut,
                onUpdate: () => {
                    this.cubes.forEach(cube => {
                        cube.children.forEach(layer => {                    
                            layer.material.uniforms.blend.value = this.state.colorProgress;
                        })                             
                    })
                },
            })
            gsap.to(this.cubeGroup.rotation, {
                y: Math.PI * 4,
                duration: duration,
                ease: Sine.easeInOut,
            })

            this.cubes.forEach(({position,rotation}) => {                
                gsap.to(position, {
                    x: 0,
                    duration: duration,                    
                    ease: Sine.easeOut,
                })                
            })
        })
        document.getElementById('btn-reset')?.addEventListener('click', e => {
            const duration = 3;            
            gsap.set(this.state, {
                colorProgress: 0,
                duration: duration,
                ease: Sine.easeInOut,
            })
            let i = 0;
            this.cubes.forEach(cube => {
                cube.position.x = 0;
                cube.children.forEach(layer => {                    
                    layer.material.uniforms.blend.value = 0;
                })               
                i++;              
            })            
            gsap.set(this.cubeGroup.rotation, {
                y: 0,
            })
        })
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