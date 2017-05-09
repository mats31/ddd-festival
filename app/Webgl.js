/* global TweenLite */
import * as THREE from 'three';
import Model from './objects/Model/Model';
import Stage from './objects/Stage/Stage';
import FBO from './objects/Particle/FBO/FBO';
import OBJLoader from './helpers/OBJLoader';
const glsl = require('glslify');
const OrbitControls = require( 'three-orbit-controls' )( THREE );

export default class Webgl {

  // Setup ---------------------------------------------------------------------

  constructor( width, height ) {
    this.params = {};

    this.quadW = window.innerWidth;
    this.quadH = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
    this.camera.position.z = 100;

    // this.orthographicCamera = new THREE.OrthographicCamera( this.quadW / - 2, this.quadW / 2, this.quadH / 2, this.quadH / - 2, -100, 100 );
    // this.orthographicCamera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    this.renderer.setClearColor( new THREE.Color('rgb(31, 31, 29)') );
    // this.renderer.setClearColor( 0x262626 );

    this.controls = new OrbitControls( this.camera );

    this.controls.enableZoom = false;
    this.controls.enablePan = false;

    this.composer = null;

    this.FBO = null;

    this.mouse = new THREE.Vector2(9999, 9999);
    this.mouseUVPosition = new THREE.Vector2(0, 0);

    this.clock = new THREE.Clock();
    this.time = 0;
    this.meshesLength = 6;
    this.meshesLoaded = 0;
    this.transition = 2;
    this.maxVerticesLength = null;
    this.models = new Array( this.meshesLength );
    this.index = 0;

    this.scaleValue = 0.1;
    this.groundPos = -15;

    this.readyToReset = false;

    const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
    this.scene.add( light );

    // const light = new THREE.PointLight( 0xffffff, 4, 100 );
    // light.position.set( 0, 50, 0 );
    // this.scene.add( light );

    this.setupRaycast();
    this.setupEvents();
    this.setupMeshes();
    this.setupStage();

    const spotLight = new THREE.SpotLight( 0xffffff, 1, 100, 1.3, 1, 2 );
    spotLight.position.set( 0, 10, 0 );
    const targetObject = new THREE.Object3D();
    targetObject.position.set( 0, 0, -10 );
    this.scene.add( targetObject );
    spotLight.target = targetObject;
    this.scene.add( spotLight );
  }

  setupRaycast() {

    this.raycaster = new THREE.Raycaster();
  }

  setupEvents() {

    window.addEventListener( 'mousemove', this.onMousemove.bind(this) );
  }

  setupMeshes() {

    const loader = new THREE.OBJLoader();

    loader.load('models/baked_01.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_01.png');
      const id = 0;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      model.rotation.y = Math.PI;
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

    loader.load('models/baked_02.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_02.png');
      const id = 1;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      model.rotation.y = 1.4 * Math.PI;
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

    loader.load('models/baked_03.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_03.png');
      const id = 2;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      model.rotation.y = Math.PI;
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

    loader.load('models/baked_04.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_04.png');
      const id = 3;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

    loader.load('models/baked_05.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_05.png');
      const id = 4;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      model.rotation.y = 1.6 * Math.PI;
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

    loader.load('models/baked_06.obj', (object) => {

      const geometry = object.children[0].geometry;
      const texture = new THREE.TextureLoader().load('textures/baked_merge_06.png');
      const id = 5;

      const model = new Model({
        geometry,
        texture,
        id,
        parent: this,
      });

      model.scale.set(this.scaleValue, this.scaleValue, this.scaleValue);
      model.position.setY(this.groundPos);
      model.rotation.y = 0;
      this.models[id] = model;

      this.meshesLoaded++;

      if (this.meshesLoaded === this.meshesLength) {

        this.setupFBO();
        this.models[0].show(this.transition);
        this.scene.add( this.models[0] );
      }
    });

  }

  setupStage() {

    this.stage = new Stage();
    this.stage.position.setY(this.groundPos);
    this.scene.add(this.stage);
  }

  setupFBO() {

    const length = 0;
    const geometry = this.models[0].geometry;

    for (let i = 0; i < this.models.length; i++) {

      const newLength = this.models[i].geometry.attributes.position.array.length;

      if (newLength > length) {

        this.maxVerticesLength = newLength;
      }
    }

    const data = this.parseMesh(geometry, this.index);
    const size = Math.sqrt( data.original.length / 4 );
    const originalPos = new THREE.DataTexture( data.original, size, size, THREE.RGBAFormat, THREE.FloatType );
    const targetPos = new THREE.DataTexture( data.target, size, size, THREE.RGBAFormat, THREE.FloatType );
    originalPos.needsUpdate = true;
    targetPos.needsUpdate = true;

    const simulationShader = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { type: 'f', value: 0 },
        u_originalPos: { type: 't', value: originalPos },
        u_targetPos: { type: 't', value: targetPos },
      },
      vertexShader: glsl.file('./objects/Particle/FBO/shaders/simulationVertex.glsl'),
      fragmentShader: glsl.file('./objects/Particle/FBO/shaders/simulationFragment.glsl'),
    });

    const texture = new THREE.TextureLoader().load( 'textures/particle.png' );

    const renderShader = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
      uniforms: {
        u_alpha: { type: 'f', value: 1 },
        u_map: { type: 't', value: texture },
        u_time: { type: 'f', value: 0 },
        positions: { type: 't', value: null },
        pointSize: { type: 'f', value: 5 },
      },
      vertexShader: glsl.file('./objects/Particle/FBO/shaders/renderVertex.glsl'),
      fragmentShader: glsl.file('./objects/Particle/FBO/shaders/renderFragment.glsl'),
    });

    this.FBO = new FBO( size, size, this.renderer, simulationShader, renderShader );
    this.FBO.particles.position.setY(this.groundPos);
    this.FBO.particles.rotation.y = Math.PI;
    this.scene.add( this.FBO.particles );

    this.displayWebgl();
  }

  // State ---------------------------------------------------------------------

  resetWebgl() {

    this.models[this.index].hide(this.transition);

    TweenLite.delayedCall(
      this.transition,
      () => {

        for (let i = 0; i < this.models.length; i++) {
          this.models[i].reset();
        }

        this.readyToReset = false;

        this.index = 0;
        this.setCurrentMesh( 0 );
        this.scene.remove( this.models[this.meshesLength - 1] );
        this.models[this.index].show(this.transition);
        this.scene.add( this.models[this.index] );
      }
    );
  }

  displayWebgl() {

    const intro = document.querySelector('.js-intro');
    const text = document.querySelector('.js-intro__text');

    TweenLite.to(
      text,
      5,
      {
        scale: 0,
        delay: 0.5,
        ease: 'Power4.easeIn',
      }
    );

    TweenLite.to(
      intro,
      2,
      {
        autoAlpha: 0,
        delay: 5.5,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this.activateIntersect = true;
        },
      }
    );
  }

  setCurrentMesh( index ) {

    // FBO
    const geometry = this.models[index].geometry;
    const data = this.parseMesh( geometry, index );
    const size = Math.sqrt( data.original.length / 4 );
    let rotation = Math.PI;
    const originalPos = new THREE.DataTexture( data.original, size, size, THREE.RGBAFormat, THREE.FloatType );
    const targetPos = new THREE.DataTexture( data.target, size, size, THREE.RGBAFormat, THREE.FloatType );
    originalPos.needsUpdate = true;
    targetPos.needsUpdate = true;

    if ( index === 1 ) {

      rotation = 1.4 * Math.PI;
    } else if ( index === 3 ) {

      rotation = 0;
    } else if ( index === 4 ) {

      rotation = 1.6 * Math.PI;
    } else if ( index === 5 ) {

      rotation = 0;
    }

    this.FBO.updatePositions( originalPos, targetPos, rotation );
  }

  getMousePosition( container, x, y ) {

    const rect = container.getBoundingClientRect();

    return [( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height];
  }

  getIntersects( point, objects ) {

    const mousePosition = new THREE.Vector2( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
    this.raycaster.setFromCamera( mousePosition, this.camera );

    return this.raycaster.intersectObjects( objects );
  }

  setTargetPosition(index, total, vertices, data) {

    switch (index) {
      case 0:
        return this.getFirstTarget(total, vertices, data);

      case 1:
        return this.getSecondTarget(total, vertices, data);

      case 2:
        return this.getThirdTarget(total, vertices, data);

      case 3:
        return this.getFourthTarget(total, vertices, data);

      case 4:
        return this.getFifthTarget(total, vertices, data);

      case 5:
        return this.getSixthTarget(total, vertices, data);
      default:
        return this.getFirstTarget();
    }
  }

  parseMesh(g, index) {

    const vertices = g.attributes.position.array;
    const total = this.maxVerticesLength + this.maxVerticesLength / 3;
    const size = parseInt( Math.sqrt( total ) + 0.5, 10 );
    const data = {};
    data.original = new Float32Array( size * size );
    data.target = new Float32Array( size * size );

    for ( let i = 0, j = 0; i < total; i += 4, j += 3 ) {

      if ( typeof vertices[j + 2] !== 'undefined' ) {

        data.original[i] = vertices[j] * this.scaleValue;
        data.original[i + 1] = vertices[j + 1] * this.scaleValue;
        data.original[i + 2] = vertices[j + 2] * this.scaleValue;
        data.original[i + 3] = 0; // If 1, no mix -> Only target position
      } else {

        data.original[i] = 0;
        data.original[i + 1] = 0;
        data.original[i + 2] = 0;
        data.original[i + 3] = 1; // If 1, no mix -> Only target position
      }
    }

    this.setTargetPosition(index, total, vertices, data);

    return data;
  }

  getFirstTarget(total, vertices, data) {

    for ( let i = 0; i < total; i += 4 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      const alpha = i % 6 === 0 ? Math.random() : 0; // If 2, no mix -> Only target position

      data.target[i] = 70 * Math.cos( Math.random() * 2 * Math.PI );
      data.target[i + 1] = 0;
      data.target[i + 2] = 50 * random * Math.sin( Math.random() * 2 * Math.PI );
      data.target[i + 3] = alpha;
    }
  }

  getSecondTarget(total, vertices, data) {

    for ( let i = 0, j = 0; i < total; i += 4, j += 1 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      let alpha = i % 3 === 0 ? 2 : 0; // If 2, no mix -> Only target position

      if (alpha === 2) {

        if (Math.random() > 0.5) {
          alpha = 2;
        } else {
          alpha = Math.random();
        }
      }

      data.target[i] = 30 * Math.cos( ( i / total ) * 4 * Math.PI );
      data.target[i + 1] = i * 0.003;
      data.target[i + 2] = 30 * Math.sin( ( i / total ) * 4 * Math.PI );
      data.target[i + 3] = alpha;
    }
  }

  getThirdTarget(total, vertices, data) {

    const xRandom = [ -40, -45, -42 ];
    const yRandom = [ 50, 50, 50 ];
    const zRandom = [ Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50 ];

    for ( let i = 0, j = 0; i < total; i += 4, j += 1 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      let alpha = i % 3 === 0 ? 2 : 0; // If 2, no mix -> Only target position

      if (alpha === 2) {

        if (Math.random() > 0.5) {
          alpha = 2;
        } else {
          alpha = Math.random();
        }
      }

      const xCenter = xRandom[ Math.round( ( i / total ) * 2 ) ];
      const yCenter = yRandom[ Math.round( ( i / total ) * 2 ) ];
      // const zCenter = xRandom[ i % ( total / zRandom.length ) ];
      //
      // data.target[i] = xCenter * Math.cos( ( i / total ) * -Math.PI );
      // data.target[i + 1] = 30 + yCenter * Math.sin( ( i / total ) * -Math.PI );
      // data.target[i + 2] = zCenter + ( i * 0.003 );
      // data.target[i + 3] = alpha;

      data.target[i] = xCenter + 40 * Math.cos( ( ( i % ( total / xRandom.length ) ) / ( total / xRandom.length ) ) * -Math.PI / 2 );
      data.target[i + 1] = yCenter + 50 * Math.sin( ( ( i % ( total / yRandom.length ) ) / ( total / yRandom.length ) ) * -Math.PI / 2 );
      data.target[i + 2] = -5 + ( i * 0.0003 );
      data.target[i + 3] = alpha;
    }
  }

  getFourthTarget(total, vertices, data) {

    for ( let i = 0, j = 0; i < total; i += 4, j += 1 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      let alpha = i % 3 === 0 ? 2 : 0; // If 2, no mix -> Only target position

      if (alpha === 2) {

        if (Math.random() > 0.5) {
          alpha = 2;
        } else {
          alpha = Math.random();
        }
      }

      data.target[i] = ( 25 - ( i * 0.001 ) ) * Math.cos( ( i / total ) * 6 * Math.PI );
      data.target[i + 1] = 10 + i * 0.003;
      data.target[i + 2] = 20 * Math.sin( ( i / total ) * 6 * Math.PI );
      data.target[i + 3] = alpha;
    }
  }

  getFifthTarget(total, vertices, data) {

    for ( let i = 0, j = 0; i < total; i += 4, j += 1 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      let alpha = i % 3 === 0 ? 2 : 0; // If 2, no mix -> Only target position

      if (alpha === 2) {

        if (Math.random() > 0.5) {
          alpha = 2;
        } else {
          alpha = Math.random();
        }
      }

      data.target[i] = ( 25 + ( i * 0.005 ) ) * Math.cos( ( i / total ) * 6 * Math.PI );
      data.target[i + 1] = Math.max( 0, -25 + i * 0.005 );
      data.target[i + 2] = ( 25 + ( i * 0.005 ) ) * Math.sin( ( i / total ) * 6 * Math.PI );
      data.target[i + 3] = alpha;
    }
  }

  getSixthTarget( total, vertices, data ) {

    for ( let i = 0, j = 0; i < total; i += 4, j += 1 ) {

      const random = Math.random() > 0.5 ? 1 : -1;
      const alpha = i % 3 === 0 ? 2 : Math.random(); // If 2, no mix -> Only target position

      data.target[i] = data.original[i];
      data.target[i + 1] = data.original[i + 1] + Math.random() * 20;
      data.target[i + 2] = data.original[i + 2];
      data.target[i + 3] = alpha;
    }
  }

  // Getters -------------------------------------------------------------------

  getIndex() {

    return this.index;
  }

  getMeshesLength() {

    return this.meshesLength;
  }

  getCurrentAverage() {

    if (typeof this.models[this.index] !== 'undefined') {

      return this.models[this.index].average;
    }

    return 0;
  }

  // Events --------------------------------------------------------------------

  onMousemove(event) {

    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onModelFill( index ) {

    if (this.index < this.meshesLength - 1) {

      this.activateIntersect = false;
      // this.FBO.hide(this.transition);
      this.models[index].hide(0.35);
      this.index++;
      this.setCurrentMesh( this.index );

      TweenLite.delayedCall(
        this.transition,
        () => {
          // Model
          this.scene.remove( this.models[this.index - 1] );
          // this.FBO.show(this.transition);
          this.models[this.index].show(this.transition);

          TweenLite.delayedCall( 2.5, () => {

            this.activateIntersect = true;
            this.scene.add( this.models[this.index] );
          });
        }
      );
    }
  }

  // Resize --------------------------------------------------------------------

  resize( width, height ) {
    if ( this.composer ) {
      this.composer.setSize( width, height );
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.width = width;
    this.height = height;

    // this.orthographicCamera.left = -this.width * 0.5;
    // this.orthographicCamera.right = this.width * 0.5;
    // this.orthographicCamera.top = this.height * 0.5;
    // this.orthographicCamera.bottom = -this.height * 0.5;
    // this.orthographicCamera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
    this.renderer.antialias = true;
  }

  // Update --------------------------------------------------------------------

  render() {

    if (this.FBO) {

      this.time = this.clock.getElapsedTime();

      this.FBO.update( this.time );
      this.updateUVCoords();

      if (this.index === this.meshesLength - 1 && this.models[this.index].average === 1) {

        this.readyToReset = true;
      } else {

        this.readyToReset = false;
      }

      this.renderer.render( this.scene, this.camera );
    }
  }

  updateUVCoords() {

    if (this.models.length > 0) {

      const array = this.getMousePosition( this.renderer.domElement, this.mouse.x, this.mouse.y );
      this.mouseUVPosition.fromArray( array );

      const intersects = this.getIntersects( this.mouseUVPosition, this.models[ this.index ].children );

      if (intersects.length > 0 && intersects[0].uv && this.activateIntersect ) {
        this.models[ this.index ].checkIntersect( intersects );
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'initial';
      }

      this.models[ this.index ].update( this.time );
    }
  }
}
