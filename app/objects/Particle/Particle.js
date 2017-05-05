import * as THREE from 'three';
const glsl = require('glslify');

export default class Particle extends THREE.Object3D {

  // Setup ---------------------------------------------------------------------

  constructor() {
    super();

    this.length = 10000;
    this.point = new THREE.Vector3();

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

  setupParticle() {

    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array( this.length * 3 );
    const sizes = new Float32Array( this.length );
    const speeds = new Float32Array( this.length );
    const radius = 80;

    for ( let i = 0, i3 = 0; i < this.length; i ++, i3 += 3 ) {

      // positions[i3 + 0] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i3 + 1] = ( Math.random() * 2 - 1 ) * radius;
      // positions[i3 + 2] = ( Math.random() * 2 - 1 ) * 100;

      positions[i3 + 0] = 0;
      positions[i3 + 1] = window.innerHeight * 0.5;
      positions[i3 + 2] = 0;

      sizes[i] = Math.max( 30, Math.random() * 60 );
      speeds[i] = Math.max( 0.25, Math.random() );
    }

    this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    this.geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    this.geometry.addAttribute( 'speed', new THREE.BufferAttribute( speeds, 1 ) );

    this.uniforms = {
      u_map: { type: 't', value: new THREE.TextureLoader().load( '/textures/particle.png' ) },
      u_position: { type: 'v3', value: new THREE.Vector3() },
      u_radius: { type: 'f', value: Math.random() },
      u_resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
      u_time: { type: 'f', value: 0 },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glsl.file( './shaders/particleVertex.glsl' ),
      fragmentShader: glsl.file( './shaders/particleFragment.glsl' ),
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    this.particleSystem = new THREE.Points( this.geometry, this.material );
    this.add( this.particleSystem );
  }

  // State ---------------------------------------------------------------------

  updatePosition(point) {

    this.point.copy( point );

    // this.material.uniforms.u_position.value = new THREE.Vector3( point.x, point.y, 0 );
  }

  // Getters -------------------------------------------------------------------

  getRaycastPlane() {

    return this.plane;
  }


  // Update --------------------------------------------------------------------

  update( time ) {

    this.geometry.attributes.position.needsUpdate = true;

    for ( let i = 0; i < this.length * 3; i += 3 ) {

      this.geometry.attributes.position.array[i + 1] -= 30 * this.geometry.attributes.speed.array[i];

      if (this.geometry.attributes.position.array[i + 1] <= window.innerHeight * -0.5) {

        this.geometry.attributes.position.array[i] = this.point.x;
        this.geometry.attributes.position.array[i + 1] = window.innerHeight * 0.5;
      }
    }

    // this.material.uniforms.u_time.value = time;
    // this.rotation.x += 0.01;
    // this.rotation.z += 0.01;
  }
}
