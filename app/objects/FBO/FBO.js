import * as THREE from 'three';
const glsl = require('glslify');
import Particle from '../Particle/Particle';

export default class FBO {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.quadW = window.innerWidth;
    this.quadH = window.innerHeight;

    this.renderer = options.renderer;

    this.setupWebgl();
    this.setupParticles();
    this.setupFBO();
  }

  // State ---------------------------------------------------------------------

  setupWebgl() {

    this.cameraPosition = new THREE.Vector3( 0, 0, 10 );
    this.cameraTarget = new THREE.Vector3( 0, 0, 0 );

    this.orthographicScene = new THREE.Scene();
    this.perspectiveScene = new THREE.Scene();

    this.orthographicCamera = new THREE.OrthographicCamera( this.quadW / - 2, this.quadW / 2, this.quadH / 2, this.quadH / - 2, -100, 100 );
    this.orthographicCamera.position.copy( this.cameraPosition );
    this.orthographicCamera.lookAt( this.cameraTarget );

    this.perspectiveCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
    this.perspectiveCamera.position.z = 100;
  }

  setupFBO() {

    const params = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      transparent: true,
    };

    this.FBO_1 = new THREE.WebGLRenderTarget( this.quadW, this.quadH, params );
    this.FBO_2 = new THREE.WebGLRenderTarget( this.quadW, this.quadH, params );

    this.geometry = new THREE.PlaneBufferGeometry( this.quadW, this.quadH, 1, 1 );

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        u_diffuse: { type: 't', value: this.FBO_1.texture },
        u_picture: { type: 't', value: new THREE.TextureLoader().load( '/textures/picture.jpg' ) },
        u_factor: { type: 'f', value: this.factor },
        u_resolution: { type: 'vec2', value: new THREE.Vector2( this.quadW, this.quadH ) },
      },
      vertexShader: glsl.file('./shaders/bufferVertex.glsl'),
      fragmentShader: glsl.file('./shaders/bufferFragment.glsl'),
    });

    this.planeBuffer = new THREE.Mesh( this.geometry, this.material );

    this.orthographicScene.add( this.planeBuffer );
  }

  setupParticles() {

    this.particle = new Particle({
      renderer: this.renderer,
    });

    this.orthographicScene.add( this.particle );
  }

  // Getters -------------------------------------------------------------------

  getTexture() {

    return this.FBO_2.texture;
  }

  // Handle --------------------------------------------------------------------

  handleMousemove(point) {

    this.particle.updatePosition(point);
  }

  // Update --------------------------------------------------------------------

  update( time ) {

    this.particle.update( time );

    this.renderer.render( this.orthographicScene, this.orthographicCamera, this.FBO_2, true );
    // this.renderer.render( this.orthographicScene, this.orthographicScene, this.FBO_2, true );

    const t1 = this.FBO_1;
    this.FBO_1 = this.FBO_2;
    this.FBO_2 = t1;

    this.planeBuffer.material.uniforms.u_diffuse.value = this.FBO_1.texture;
  }
}
