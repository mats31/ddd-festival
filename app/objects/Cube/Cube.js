import * as THREE from 'three';
const glsl = require('glslify');

export default class Cube extends THREE.Object3D {
  constructor() {
    super();

    this.geometry = new THREE.BoxGeometry( 10, 10, 10 );

    this.uniforms = {
      u_map: { type: 't', value: new THREE.TextureLoader().load('/textures/texture.png') },
    };

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: this.uniforms,
      vertexShader: glsl.file('./shaders/cubeVertex.glsl'),
      fragmentShader: glsl.file('./shaders/cubeFragment.glsl'),
    });

    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.add( this.mesh );
  }

  update() {
    this.rotation.x += 0.01;
    this.rotation.z += 0.01;
  }
}
