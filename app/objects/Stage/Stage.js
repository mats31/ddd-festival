import * as THREE from 'three';
const glsl = require('glslify');

export default class Stage extends THREE.Object3D {
  constructor() {
    super();

    this.setupFloor();
  }

  setupFloor() {

    const groundGeometry = new THREE.PlaneBufferGeometry( 200, 200, 1, 1 );
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('rgb(31, 31, 29)'),
      side: THREE.BackSide
    });
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );

    ground.rotation.x = Math.PI / 2;

    this.add(ground);

    const wallGeometry = new THREE.PlaneBufferGeometry( 300, 300, 1, 1 );
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('rgb(31, 31, 29)'),
      side: THREE.FrontSide
    });
    const wall = new THREE.Mesh( wallGeometry, wallMaterial );
    wall.position.setZ(-50);

    this.add(ground);
    this.add(wall);
  }

  update() {
    this.rotation.x += 0.01;
    this.rotation.z += 0.01;
  }
}
