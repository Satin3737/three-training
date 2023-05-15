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
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100);
camera.position.set(0, 0, 3);
scene.add(camera);

const sceneCenter = new THREE.Vector3();

// custom camera controls
const cursor = {x: 0, y: 0};
window.addEventListener('mousemove', (e) =>{
    cursor.x = (e.clientX / sizes.width - 0.5) * 2; // (mouse pos / screen size - half screen size) * 2
    cursor.y = -(e.clientY / sizes.height - 0.5) * 2; // (mouse pos / screen size - half screen size) * 2
});

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});
const canvas = renderer.domElement;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(canvas);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// orbit controls camera
// const orbitControls = new OrbitControls(camera, canvas);
// orbitControls.enableDamping = true; // added smooth camera moving

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xFF0000})
);
cube.rotation.x = 0.5;
cube.rotation.z = 3;
scene.add(cube);

const animate = () => {
    // cube animation
    cube.rotation.y += 0.01 * Math.PI * 0.5;
    
    // update camera
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3; // PI for full circle * multiply for camera distance
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3; // PI for full circle * multiply for camera distance
    camera.position.y = cursor.y * 5; // * multiply for camera distance
    camera.lookAt(sceneCenter); // loot at center of tje scene
    
    // orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
