precision highp float;
uniform float time;
uniform float scrollY;
uniform float opacity;
uniform vec3 color1;
uniform vec3 color2;
uniform float layerProgress;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 nv = uv * 2.0 - 1.0;

  vec3 color = mix(color1,color2,layerProgress);
  
  gl_FragColor = vec4(color,opacity);
}
