import * as THREE from 'three';
import FBO from './FBO/FBO';
const glsl = require('glslify');

export default class Particle extends THREE.Object3D {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    super();

    this.renderer = options.renderer;
    this.length = 100;

    this.setupRaycastPlane();
    this.setupParticle();
  }

  setupRaycastPlane() {

    this.plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 1000, 1000, 8, 8 ),
			new THREE.MeshBasicMaterial( { visible: false } )
		);

    this.add( this.plane );
  }

  // __setupParticle() {
  //
  //   this.geometry = new THREE.BufferGeometry();
  //
  //   const positions = new Float32Array( this.length * 3 );
  //   const sizes = new Float32Array( this.length );
  //   const speeds = new Float32Array( this.length );
  //   const radius = 80;
  //
  //   for ( let i = 0, i3 = 0; i < this.length; i ++, i3 += 3 ) {
  //     positions[i3 + 0] = ( Math.random() * 2 - 1 ) * radius;
  //     positions[i3 + 1] = ( Math.random() * 2 - 1 ) * radius;
  //     positions[i3 + 2] = ( Math.random() * 2 - 1 ) * 100;
  //
  //     sizes[i] = 10;
  //     speeds[i] = Math.random();
  //   }
  //
  //   this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  //   this.geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  //   this.geometry.addAttribute( 'speed', new THREE.BufferAttribute( speeds, 1 ) );
  //
  //   this.uniforms = {
  //     u_map: { type: 't', value: new THREE.TextureLoader().load( '/textures/particle.png' ) },
  //     u_position: { type: 'v3', value: new THREE.Vector3() },
  //     u_radius: { type: 'f', value: Math.random() },
  //     u_resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
  //     u_time: { type: 'f', value: 0 },
  //   };
  //
  //   this.material = new THREE.ShaderMaterial({
  //     uniforms: this.uniforms,
  //     vertexShader: glsl.file( './shaders/particleVertex.glsl' ),
  //     fragmentShader: glsl.file( './shaders/particleFragment.glsl' ),
  //     blending: THREE.AdditiveBlending,
  //     depthTest: false,
  //     transparent: true,
  //   });
  //
  //   this.particleSystem = new THREE.Points( this.geometry, this.material );
  //   this.add( this.particleSystem );
  // }

  setupParticle() {

    this.width = 64;
    this.height = 64;

    const data = this.getRandomData( this.width, this.height, 2500 );

    const positions = new THREE.DataTexture( data, this.width, this.height, THREE.RGBFormat, THREE.FloatType );
    positions.needsUpdate = true;

    const simulationShader = new THREE.ShaderMaterial({
      uniforms: { positions: { type: "t", value: positions } },
      vertexShader: glsl.file( './FBO/shaders/simulationVertex.glsl' ),
      fragmentShader: glsl.file( './FBO/shaders/simulationFragment.glsl' ),
    });

    const renderShader = new THREE.ShaderMaterial( {
      uniforms: {
        positions: { type: "t", value: null },
        pointSize: { type: "f", value: 2 },
      },
      vertexShader: glsl.file( './FBO/shaders/renderVertex.glsl' ),
      fragmentShader: glsl.file( './FBO/shaders/renderFragment.glsl' ),
    });

    this.FBO = new FBO( this.width, this.height, this.renderer, simulationShader, renderShader );
    this.add( this.FBO.particles );
  }

  getRandomData( width, height, size ) {

    let len = width * height * 3;
    const data = new Float32Array( len );
    while ( len-- ) data[len] = ( Math.random() * 2 - 1 ) * size;

    return data;
  }


  // State ---------------------------------------------------------------------

  updatePosition(point) {

    const len = this.width * this.height * 3;
    const data = new Float32Array( len );

    for ( let i = 0; i < len; i += 3 ) {

      data[i] = point.x;
      data[i + 1] = point.y;
      data[i + 2] = 0;
    }

    const positions = new THREE.DataTexture( data, this.width, this.height, THREE.RGBFormat, THREE.FloatType );
    positions.needsUpdate = true;

    this.FBO.updatePositions(positions);
  }

  // Getters -------------------------------------------------------------------

  getRaycastPlane() {

    return this.plane;
  }


  // Update --------------------------------------------------------------------

  update( time ) {

    // this.material.uniforms.u_time.value = time;
    this.FBO.update();
  }
}
