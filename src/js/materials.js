import * as THREE from "three";
import "../scss/style.scss";
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

import baseColorTexture from "../img/door/Door_Wood_001_basecolor.jpg";
import ambientOcclusionTexture from "../img/door/Door_Wood_001_ambientOcclusion.jpg";
import heightTexture from "../img/door/Door_Wood_001_height.png";
import metalnessTexture from "../img/door/Door_Wood_001_metallic.jpg";
import roughnessTexture from "../img/door/Door_Wood_001_roughness.jpg";
import opacityTexture from "../img/door/Door_Wood_001_opacity.jpg";
import normalTexture from "../img/door/Door_Wood_001_normal.jpg";
import materialTexture from "../img/door/Material_843.png";
import matcapTexture from "../img/matcaps/8.png";
import gradientTexture from "../img/gradients/3.jpg";

const textureRoutes = {
    baseColorTexture,
    ambientOcclusionTexture,
    heightTexture,
    metalnessTexture,
    roughnessTexture,
    opacityTexture,
    normalTexture,
    materialTexture,
    matcapTexture,
    gradientTexture
};

const texturesObj = {};
const textureLoader = new THREE.TextureLoader();
for (let key in textureRoutes) {
    texturesObj[key] = textureLoader.load(textureRoutes[key]);
}
console.log(texturesObj);

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

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

// materials

// basic material (many of properties from basic material work the same with other materials)
const basicMaterial = new THREE.MeshBasicMaterial({
    // will work
    // color: 'red',
    // map: texturesObj.baseColorTexture
});

// second variant to set properties for material
// basicMaterial.wireframe = true;

// occur error because material color is class, so need to use .set method or new Color constructor
// basicMaterial.color = 'red';
console.log(basicMaterial.color)
basicMaterial.color.set('white');
// also will work
// basicMaterial.color = new THREE.Color('pink');

// we can combine color and map
basicMaterial.map = texturesObj.baseColorTexture;

// to use opacity need to specify transparent
// basicMaterial.transparent = true;
// basicMaterial.opacity = 0.5;

// alpha map controls transparency with texture (also need specify transparent first)
basicMaterial.transparent = true;
basicMaterial.alphaMap = texturesObj.opacityTexture;

// side property - 3 different values: front (default), back, both sides
basicMaterial.side = THREE.DoubleSide;


// normal material
// wireframe, transparent, opacity, side working the same as basic material
const normalMaterial = new THREE.MeshNormalMaterial();
normalMaterial.side = THREE.DoubleSide;

// new property flatShading
// made faces flatten
normalMaterial.flatShading = true;


// matcap material
// matcap display color using normal as reference
// we can simulate light and shadows on meshes without having light on scene
const matcapMaterial = new THREE.MeshMatcapMaterial();
matcapMaterial.side = THREE.DoubleSide;
matcapMaterial.matcap = texturesObj.matcapTexture;

const createMeshes = (material, positions) => {
    const {spherePos, planePos, torusPos} = positions;
    
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
    sphere.position.set(...spherePos);
    
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    plane.position.set(...planePos);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material);
    torus.position.set(...torusPos);
    
    return [sphere, plane, torus];
};

const meshes = [
    ...createMeshes(basicMaterial, {spherePos: [2, 0, 0], planePos: [0, 0, 0], torusPos: [-2, 0, 0]}),
    ...createMeshes(normalMaterial, {spherePos: [2, 0, -2], planePos: [0, 0, -2], torusPos: [-2, 0, -2]}),
    ...createMeshes(matcapMaterial, {spherePos: [2, 0, -4], planePos: [0, 0, -4], torusPos: [-2, 0, -4]}),
];
scene.add(...meshes);

const animate = () => {
    meshes.forEach(mesh => {
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.005;
    });
    
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
