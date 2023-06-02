import * as THREE from "three";
import "../scss/style.scss";
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as dat from 'dat.gui';

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

const environmentalMapTexture = new THREE.CubeTextureLoader()
    .setPath('../environmentMaps/1/')
    .load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg'
    ]);

const scene = new THREE.Scene();

scene.background = environmentalMapTexture;

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

// add light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);


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


// MeshDepth material
// change color according to camera position
// near - white, far - black
const meshDepthMaterial = new THREE.MeshDepthMaterial();
meshDepthMaterial.side = THREE.DoubleSide;


// meshLambert material
// react to lights on scene
// very good performance
const meshLambertMaterial = new THREE.MeshLambertMaterial();
meshLambertMaterial.side = THREE.DoubleSide;


// meshPhong material
// the same as previous but without possible light artifacts and with reflections
const meshPhongMaterial = new THREE.MeshPhongMaterial();
meshPhongMaterial.side = THREE.DoubleSide;

// we can control this reflection with shininess property and reflection color with specular property
meshPhongMaterial.shininess = 100;
meshPhongMaterial.specular = new THREE.Color(0x1188FF);


// meshToon material
// looks like cartoon, and we can add gradient texture
const meshToonMaterial = new THREE.MeshToonMaterial({color: 0x1188FF});
meshToonMaterial.side = THREE.DoubleSide;
texturesObj.gradientTexture.minFilter = THREE.NearestFilter;
texturesObj.gradientTexture.magFilter = THREE.NearestFilter;
texturesObj.gradientTexture.generateMipmaps = false;
meshToonMaterial.gradientMap = texturesObj.gradientTexture;


// meshStandard material
// it used physically correct rendering
const meshStandardMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    // roughness: 0.45,
    // metalness: 0.8,
    map: texturesObj.baseColorTexture,
    aoMap: texturesObj.ambientOcclusionTexture,
    aoMapIntensity: 1,
    displacementMap: texturesObj.heightTexture,
    displacementScale: 0.05,
    metalnessMap: texturesObj.metalnessTexture,
    roughnessMap: texturesObj.roughnessTexture,
    normalMap: texturesObj.normalTexture,
    transparent: true,
    alphaMap: texturesObj.opacityTexture
});
meshStandardMaterial.normalScale.set(0.5, 0.5);

// aoMap create fake shadows in curves
// displacementMap create heights on textures
// displacementScale set that height
// metalnessMap and roughnessMap don't use with metalness and roughness
// normalMap added details to texture


// meshPhysical material
// same as standard material but support clear coat effect
const meshPhysicalMaterial = new THREE.MeshPhysicalMaterial();
meshPhysicalMaterial.side = THREE.DoubleSide;


// debug
const gui = new dat.GUI();
const debugObj = {
    color: 0xFFFFFF
};

gui.add(meshStandardMaterial, 'metalness').min(0).max(1).step(0.001);
gui.add(meshStandardMaterial, 'roughness').min(0).max(1).step(0.001);
gui.add(meshStandardMaterial, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(meshStandardMaterial, 'displacementScale').min(0).max(1).step(0.001);
gui.addColor(debugObj, 'color').onChange(() => meshStandardMaterial.color.set(debugObj.color));

const setUvCoordinatesForAOMap = (mesh) => {
    // set uv2 coordinates for ambient occlusion map
    mesh.geometry.setAttribute(
        'uv2',
        new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
    );
}

const createMeshes = (material, positions) => {
    const {spherePos, planePos, torusPos} = positions;
    
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
    sphere.position.set(...spherePos);
    setUvCoordinatesForAOMap(sphere);
    
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
    plane.position.set(...planePos);
    setUvCoordinatesForAOMap(plane);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);
    torus.position.set(...torusPos);
    setUvCoordinatesForAOMap(torus);
    
    return [sphere, plane, torus];
};

const meshes = [
    ...createMeshes(basicMaterial, {spherePos: [2, 0, 0], planePos: [0, 0, 0], torusPos: [-2, 0, 0]}),
    ...createMeshes(normalMaterial, {spherePos: [2, 0, -2], planePos: [0, 0, -2], torusPos: [-2, 0, -2]}),
    ...createMeshes(matcapMaterial, {spherePos: [2, 0, -4], planePos: [0, 0, -4], torusPos: [-2, 0, -4]}),
    ...createMeshes(meshDepthMaterial, {spherePos: [2, 0, -6], planePos: [0, 0, -6], torusPos: [-2, 0, -6]}),
    ...createMeshes(meshLambertMaterial, {spherePos: [2, 0, -8], planePos: [0, 0, -8], torusPos: [-2, 0, -8]}),
    ...createMeshes(meshPhongMaterial, {spherePos: [2, 0, -10], planePos: [0, 0, -10], torusPos: [-2, 0, -10]}),
    ...createMeshes(meshToonMaterial, {spherePos: [2, 0, -12], planePos: [0, 0, -12], torusPos: [-2, 0, -12]}),
    ...createMeshes(meshPhysicalMaterial, {spherePos: [2, 0, -14], planePos: [0, 0, -14], torusPos: [-2, 0, -14]}),
    ...createMeshes(meshStandardMaterial, {spherePos: [2, 0, 2], planePos: [0, 0, 2], torusPos: [-2, 0, 2]}),
];
scene.add(...meshes);

const animate = () => {
    meshes.forEach(mesh => {
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.002;
    });
    
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
