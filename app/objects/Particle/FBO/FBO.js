import * as THREE from 'three';

export default class FBO {

  constructor( width, height, renderer, simulationMaterial, renderMaterial ) {

    const gl = renderer.getContext();

    // 1 we need FLOAT Textures to store positions
    // https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
    if (!gl.getExtension("OES_texture_float")) {

      throw new Error( "float textures not supported" );
    }

    // 2 we need to access textures from within the vertex shader
    // https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
    if ( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0 ) {

      throw new Error( "vertex shader cannot read textures" );
    }

    // 3 rtt setup
    this.scene = new THREE.Scene();
    this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow( 2, 53 ), 1);

    // 4 create a target texture
    const options = {
      minFilter: THREE.NearestFilter, // important as we want to sample square pixels
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat, // could be RGBAFormat
      type: THREE.FloatType, // important as we need precise coordinates (not ints)
    };
    this.rtt = new THREE.WebGLRenderTarget(width, height, options);


    // 5 the simulation:
    // create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
    const geom = new THREE.BufferGeometry();
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([-1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) );
    geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([0,1, 1,1, 1,0, 0,1, 1,0, 0,0 ]), 2 ) );

    this.simulationMesh = new THREE.Mesh( geom, simulationMaterial );
    this.scene.add( this.simulationMesh );


    // 6 the particles:
    // create a vertex buffer of size width * height with normalized coordinates
    const l = (width * height );
    const vertices = new Float32Array( parseInt( l * 3, 10 ) );
    const randoms = new Float32Array( parseInt( l, 10 ) );
    for ( let i = 0; i < l; i++ ) {

      const i3 = i * 3;
      vertices[i3] = ( i % width ) / width;
      vertices[i3 + 1] = ( i / width ) / height;

      randoms[i] = Math.random() * 0.9 + 0.1;
    }

    // create the particles geometry
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'random', new THREE.BufferAttribute( randoms, 1 ) );

    // the rendermaterial is used to render the particles
    this.particles = new THREE.Points( geometry, renderMaterial );
    this.renderer = renderer;

    this.easingOriginalPos = null;
    this.easingTargetPos = null;
    this.rotationTarget = null;
    this.transition = false;
    this.transitionValue = 0.02;
  }

  show(timer) {

    TweenLite.killTweensOf( this.particles.material.uniforms.u_alpha );
    TweenLite.to(
      this.particles.material.uniforms.u_alpha,
      timer,
      {
        value: 1,
        ease: 'Power2.easeIn',
      }
    );
  }

  hide(timer) {

    TweenLite.killTweensOf( this.particles.material.uniforms.u_alpha );
    TweenLite.to(
      this.particles.material.uniforms.u_alpha,
      timer,
      {
        value: 0,
        ease: 'Power2.easeIn',
      }
    );
  }

  updatePositions( originalPos, targetPos, rotation ) {

    // TweenLite.to(
    //   this.simulationMesh.material.uniforms.u_mixValue,
    //   3,
    //   {
    //     ease: 'Power2.easeInOut',
    //     value: 1,
    //     onComplete: () => {
    //
    //       this.easingOriginalPos = originalPos;
    //       this.easingTargetPos = targetPos;
    //
    //       // this.simulationMesh.material.uniforms.u_originalPos.value = originalPos;
    //       // this.simulationMesh.material.uniforms.u_targetPos.value = targetPos;
    //       // this.particles.rotation.y = rotation;
    //
    //       this.transition = true;
    //     }
    //   }
    // );
    //
    // TweenLite.to(
    //   this.simulationMesh.material.uniforms.u_mixValue,
    //   3,
    //   {
    //     ease: 'Power2.easeInOut',
    //     delay: 3,
    //     value: 0,
    //   }
    // );

    this.easingOriginalPos = originalPos;
    this.easingTargetPos = targetPos;
    this.rotationTarget = rotation;

    // this.simulationMesh.material.uniforms.u_originalPos.value = originalPos;
    // this.simulationMesh.material.uniforms.u_targetPos.value = targetPos;
    // this.particles.rotation.y = rotation;

    this.transition = true;
  }

  update(time) {

    // 1 update the simulation and render the result in a target texture
    this.renderer.render( this.scene, this.orthoCamera, this.rtt, true );

    // 2 use the result of the swap as the new position for the particles renderer
    this.particles.material.uniforms.positions.value = this.rtt.texture;
    this.simulationMesh.material.uniforms.u_time.value = time;
    this.particles.material.uniforms.u_time.value = time;

    if (this.transition) {

      const original = this.simulationMesh.material.uniforms.u_originalPos.value.image.data;
      const target = this.simulationMesh.material.uniforms.u_targetPos.value.image.data;
      const targetOriginal = this.easingOriginalPos.image.data;
      const targetFinal = this.easingTargetPos.image.data;

      for (let i = 0; i < original.length; i += 4) {

        original[i] += ( targetOriginal[i] - original[i] ) * this.transitionValue;
        original[i + 1] += ( targetOriginal[i + 1] - original[i + 1] ) * this.transitionValue;
        original[i + 2] += ( targetOriginal[i + 2] - original[i + 2] ) * this.transitionValue;
        original[i + 3] += ( targetOriginal[i + 3] - original[i + 3] ) * this.transitionValue;

        target[i] += ( targetFinal[i] - target[i] ) * this.transitionValue;
        target[i + 1] += ( targetFinal[i + 1] - target[i + 1] ) * this.transitionValue;
        target[i + 2] += ( targetFinal[i + 2] - target[i + 2] ) * this.transitionValue;
        target[i + 3] += ( targetFinal[i + 3] - target[i + 3] ) * this.transitionValue;
      }

      this.particles.rotation.y += ( this.rotationTarget - this.particles.rotation.y ) * this.transitionValue;
    }

    this.simulationMesh.material.uniforms.u_originalPos.value.needsUpdate = true;
    this.simulationMesh.material.uniforms.u_targetPos.value.needsUpdate = true;
  }

}
