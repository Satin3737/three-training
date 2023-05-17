import * as THREE from 'three';
import '../scss/style.scss';
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as dat from 'dat.gui';
import gsap from 'gsap';

const scene = new THREE.Scene();
const gui = new dat.GUI();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100);
camera.position.set(0, 2, 3);
scene.add(camera);

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

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
const cube = new THREE.Mesh(geometry, material);
cube.visible = true;
scene.add(cube);

//debug
// 1. object with value for change, 2. name of property (obj key), 3. min value, 4. max value, 5. value step
gui.add(cube.position, 'y', -3, 3, 0.01); // range
// another variant is use methods (not args) for min/max/step value
gui.add(cube.position, 'x').min(-3).max(3).step(0.01).name('cube X axes');

gui.add(cube, 'visible'); // checkbox
gui.add(material, 'wireframe'); // checkbox

const debugObj = {
    color: 0xFFFFFF,
    spin: () => {
        gsap.to(cube.rotation, {
            y: cube.rotation.y + 10,
            duration: 1
        });
    }
};
// for change color need to create obj with params and use onChange on it
gui.addColor(debugObj, 'color').onChange(() => material.color.set(debugObj.color));

// for providing function to gui need to use obj to (function must be obj method)
gui.add(debugObj, 'spin');

const animate = () => {
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
