/* global TweenLite */
import * as THREE from 'three';
const glsl = require('glslify');

export default class Model extends THREE.Object3D {
  constructor(options) {
    super();

    this.canvasWidth = 256;
    this.canvasHeight = 256;

    this.average = 0;

    this.activateIntersect = true;
    this.intersected = false;

    this.geometry = options.geometry;
    this.texture = options.texture;
    this._parent = options.parent;
    this._id = options.id;
    // this.geometry = new THREE.BoxGeometry( 10, 10, 10, 1, 1 );

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.context = this.canvas.getContext('2d');
    // this.context.fillStyle = 'red';
    // this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );

    // Debug
    // this.canvas.style.left = '0px';
    // this.canvas.style.top = '0px';
    // this.canvas.style.position = 'absolute';
    // document.body.appendChild(this.canvas);

    this.arcs = [];

    this.mask = new THREE.Texture( this.canvas );
    this.mask.needsUpdate = true;

    this.uniforms = {
      u_alpha: { type: 'f', value: 1 },
      u_map: { type: 't', value: this.texture },
      u_mask: { type: 't', value: this.mask },
      u_time: { type: 'f', value: 0 },
    };

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: this.uniforms,
      vertexShader: glsl.file('./shaders/modelVertex.glsl'),
      fragmentShader: glsl.file('./shaders/modelFragment.glsl'),
    });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    // this.mesh.position.setY(-20);

    this.add( this.mesh );
  }

  // State --------------------------------------------------------------------

  reset() {

    this.context.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
    this.mask.needsUpdate = true;
    this.activateIntersect = true;
    this.average = 0;
    this.arcs = [];
  }

  checkIntersect( intersects ) {

    if (this.activateIntersect) {

      const uv = intersects[0].uv;
      intersects[0].object.material.uniforms.u_map.value.transformUv(uv);

      // console.info(uv);

      // this._awwwardTexture.activateRender();
      this.onIntersect( uv );
    }
  }

  onIntersect( uv ) {

    const x = this.canvasWidth * uv.x;
    const y = this.canvasWidth * uv.y;

    this.arcs.push({
      x,
      y,
      radius: 0,
    });

    if (this.arcs.length > 200) {

      this.arcs.shift();
    }

    this.intersected = true;
  }

  checkFill() {

    this.interval = setInterval( () => {

      const imgDatas = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );
      let sum = 0;

      for (let i = 0; i < imgDatas.data.length; i += 4) {

        if ( imgDatas.data[i + 3] > 0 ) { sum++; }
      }

      this.average = sum / ( imgDatas.data.length / 4 );

      if (this.average > 0.99) {

        this.activateIntersect = false;
        this.average = 1;
        this.arcs = [];

        clearInterval(this.interval);
        this._parent.onModelFill( this._id );
      }
    }, 1000);
  }

  show(timer) {

    TweenLite.killTweensOf( this.mesh.material.uniforms.u_alpha );
    TweenLite.to(
      this.mesh.material.uniforms.u_alpha,
      timer,
      {
        value: 1,
        ease: 'Power2.easeIn',
      }
    );

    this.checkFill();
  }

  hide(timer) {

    TweenLite.killTweensOf( this.mesh.material.uniforms.u_alpha );
    TweenLite.to(
      this.mesh.material.uniforms.u_alpha,
      timer,
      {
        value: 0,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.arcs = [];
          this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        },
      }
    );
  }

  // Getters --------------------------------------------------------------------


  // Update --------------------------------------------------------------------

  update(time) {

    this.mesh.material.uniforms.u_time.value = time;

    for (let i = 0; i < this.arcs.length; i++) {

      const arc = this.arcs[i];

      arc.radius += 0.35;

      this.context.beginPath();
      this.context.fillStyle = 'white';
      this.context.arc( arc.x, arc.y, arc.radius, 0, 2 * Math.PI );
      this.context.fill();
      this.context.closePath();

      if (i === this.arcs.length - 1) { this.mask.needsUpdate = true; }
    }
  }
}
