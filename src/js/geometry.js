import * as THREE from 'three';
import '../scss/style.scss';
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const aspectRatio = sizes.width / sizes.height;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});
const canvas = renderer.domElement;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(canvas);

const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
camera.position.set(0, 0, 3);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 2, 4, 6), /// 4,5,6 argument - number of faces
    new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true})
);
scene.add(cube);

// positioning for vertices

// const positionsArray = new Float32Array(9);

// positionsArray[0] = 0; // x
// positionsArray[1] = 0; // y
// positionsArray[2] = 0; // z
//
// positionsArray[3] = 0; // x
// positionsArray[4] = 1; // y
// positionsArray[5] = 0; // z
//
// positionsArray[6] = 1; // x
// positionsArray[7] = 0; // y
// positionsArray[8] = 0; // z

// equal to:

const positionsArray = new Float32Array([
    0, 0, 0, // x, y, z
    0, 1, 0, // x, y, z
    1, 0, 0  // x, y, z
]);

const positionAttribute = new THREE.BufferAttribute(positionsArray, 3); // provide float32array and number on vertices
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionAttribute); // provide name of attribute and bufferAttribute
// faces compiled automatically

const triangle = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true})
);
triangle.position.x = -2;
scene.add(triangle);


// create a random mesh
const count = 500; // want render 500 triangles
const numberOfPoints = count * 3 * 3; // number of triangles * number of vertices per triangle * number of points for each vertice
const randomPositionsArray = new Float32Array(numberOfPoints); // create pos array

for (let i = 0; i < numberOfPoints; i++) {
    randomPositionsArray[i] = Math.random(); // fill array with random values
}

const randomGeometry = new THREE.BufferGeometry();
const randomAttribute = new THREE.BufferAttribute(randomPositionsArray, 3); // 3 coordinates per one vertice
randomGeometry.setAttribute('position', randomAttribute);

const randomMesh = new THREE.Mesh(
    randomGeometry,
    new THREE.MeshBasicMaterial({color: 0x0000FF, wireframe: true})
);
randomMesh.position.x = 2;
scene.add(randomMesh);

const animate = () => {
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
