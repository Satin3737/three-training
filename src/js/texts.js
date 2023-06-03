import * as THREE from "three";
import "../scss/style.scss";
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import matcapTexture from "../img/matcaps/4.png";

const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
camera.position.set(0, 0, 3);
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

const textureLoader = new THREE.TextureLoader();
const matcapMap = textureLoader.load(matcapTexture);
const material = new THREE.MeshMatcapMaterial({matcap: matcapMap});

// font loader
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
    console.log(font);
    const textGeometry = new TextGeometry('Some text here', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 64,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    });
    
    // centre text calculating (minus bevel)
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    // );
    textGeometry.center();
    
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
});

console.time('donuts');

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 40, 90);
for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scaleModifier = Math.random();
    donut.scale.set(scaleModifier, scaleModifier, scaleModifier);
    scene.add(donut);
}

console.timeEnd('donuts');

const animate = () => {
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
