precision highp float;
uniform float time;
uniform float scrollY;
uniform float opacity;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 lastcolor1;
uniform vec3 lastcolor2;
uniform vec3 lastcolor3;
uniform float layerProgress;
uniform float blend;
varying vec2 vUv;

vec3 lastcolorList(int i) {
  if(i == 0) {
    return lastcolor1;

  }
  if(i == 1) {
    return lastcolor2;
  }
  if(i == 2) {
    return lastcolor3;
  }
}

void main() {
  vec2 uv = vUv;
  vec2 nv = uv * 2.0 - 1.0;
  
  vec3 fistcolor = mix(color1,color2,layerProgress);


  float lastProgress = layerProgress * 2.0;
  int index = int(lastProgress);    
  vec3 lastcolor = mix(lastcolorList(index),lastcolorList(index + 1),fract(lastProgress));

  vec3 color = mix(fistcolor,lastcolor,blend);
    
  gl_FragColor = vec4(color,opacity);
}
