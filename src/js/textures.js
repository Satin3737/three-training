import * as THREE from "three";
import "../scss/style.scss";
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

import textureBaseColor from "../img/door/Door_Wood_001_basecolor.jpg";
import textureAmbientOcclusion from "../img/door/Door_Wood_001_ambientOcclusion.jpg";
import textureHeight from "../img/door/Door_Wood_001_height.png";
import textureMetalness from "../img/door/Door_Wood_001_metallic.jpg";
import textureRoughness from "../img/door/Door_Wood_001_roughness.jpg";
import textureOpacity from "../img/door/Door_Wood_001_opacity.jpg";
import textureNormal from "../img/door/Door_Wood_001_normal.jpg";
import textureMaterial from "../img/door/Material_843.png";

const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 100);
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

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 100);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

// loading texture using Image constructor (texture files in public folder)
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => texture.needsUpdate = true;
// image.src = '/textures/door/Door_Wood_001_basecolor.jpg';
// console.log(texture);

const doorTextureObj = {
    textureAmbientOcclusion,
    textureBaseColor,
    textureHeight,
    textureMetalness,
    textureNormal,
    textureOpacity,
    textureRoughness,
    textureMaterial
};

// loading texture using textureLoader
// const textureLoader = new THREE.TextureLoader();
// // path and 3 callbacks
// const texture = textureLoader.load(doorTextureObj.textureBaseColor, () => {
//     console.log('load');
// }, () => {
//     console.log('progress');
// }, () => {
//     console.log('error');
// });

// loading manager for multiple loadings
const loadingManager = new THREE.LoadingManager();

// manager callbacks
loadingManager.onStart = () => console.log('start');
loadingManager.onLoad = () => console.log('load');
loadingManager.onProgress = () => console.log('progress');
loadingManager.onError = () => console.log('error');

const textureLoader = new THREE.TextureLoader(loadingManager);
const doorBaseColor = textureLoader.load(doorTextureObj.textureBaseColor);
const doorAmbientOcclusion = textureLoader.load(doorTextureObj.textureAmbientOcclusion);
const doorHeight = textureLoader.load(doorTextureObj.textureHeight);
const doorMetalness = textureLoader.load(doorTextureObj.textureMetalness);
const doorNormal = textureLoader.load(doorTextureObj.textureNormal);
const doorOpacity = textureLoader.load(doorTextureObj.textureOpacity);
const doorRoughness = textureLoader.load(doorTextureObj.textureRoughness);
const doorMaterial = textureLoader.load(doorTextureObj.textureMaterial);

// texture transformation

// repeat textures
doorBaseColor.repeat.set(3, 3);
doorBaseColor.wrapS = THREE.RepeatWrapping;
doorBaseColor.wrapT = THREE.RepeatWrapping;

// texture offset
doorBaseColor.offset.set(0.5, 0.5);

// texture rotation
// rotate around corner
doorBaseColor.rotation = Math.PI * 0.25;

// rotate around center
// replace center rotation uv to center
doorBaseColor.center.set(0.5, 0.5);

// texture filtering

// minFilter - sharping when texture bigger than object
doorBaseColor.minFilter = THREE.NearestFilter;
// for NearestFilter on minFilter need to disable mipmaps
doorBaseColor.generateMipmaps = false;

// minFilter - sharping when texture smaller than object
doorBaseColor.magFilter = THREE.NearestFilter;

const geometry = new THREE.BoxGeometry(1, 1, 1);
console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({map: doorBaseColor});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const animate = () => {
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
