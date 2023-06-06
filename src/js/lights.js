import * as THREE from "three";
import "../scss/style.scss";
import {canvasResponsive} from "./helper.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import * as dat from 'dat.gui';
import {RectAreaLightHelper} from "three/addons/helpers/RectAreaLightHelper.js";

const gui = new dat.GUI();
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

// lights

// ambient light
// lights from everywhere, from every directions
// color, intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
// equals
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5;


// directional light
// direct lights to center of the scene
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);


// hemisphere light
// two colors, first one on top, second on bottom
// works like ambient
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);


// point light
// lights to all directions from small point
// two new params distance and decay
// distance - is like fade distance
// decay - how fast light dim
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);


// rect area light
// two last params - width and height
// rectangle light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
// look to the center of the scene
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);


// spotlight
// like flashlight
const spotLight = new THREE.SpotLight(
    0x78ff00, // color
    0.5, // intensity
    10, // distance
    Math.PI * 0.1, // angle
    0.25, // penumbra (blur on ages of the light)
    1 // decay (fade)
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
// to rotate spotlight need to add position to target property of spotlight
// and add target to the scene
console.log(spotLight.target);
scene.add(spotLight.target);
spotLight.target.position.z = -2;


// debug
gui.add(spotLight, 'intensity').min(0).max(1).step(0.001);
gui.add(spotLight, 'distance').min(0).max(20).step(0.001);
gui.add(spotLight, 'angle').min(Math.PI * 0.01).max(Math.PI).step(0.001);
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.001);
gui.add(spotLight, 'decay').min(0).max(1).step(0.001);


// helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// spotLightHelper has no size
// need to update method in animate func
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// rect area light helper
// it has separated import, not from three js
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);


const standardMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.4
});

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    standardMaterial
);
plane.rotation.x = Math.PI * 0.5;
plane.position.y = -1;
scene.add(plane);

const createMeshes = (material, positions) => {
    const {spherePos, boxPos, torusPos} = positions;
    
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
    sphere.position.set(...spherePos);
    
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    box.position.set(...boxPos);
    
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material);
    torus.position.set(...torusPos);
    
    return [sphere, box, torus];
};

const meshes = [
    ...createMeshes(standardMaterial, {spherePos: [2, 0, 0], boxPos: [0, 0, 0], torusPos: [-2, 0, 0]}),
];
scene.add(...meshes);

const animate = () => {
    // update spotLightHelper
    spotLightHelper.update();
    
    meshes.forEach(mesh => {
        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.002;
    });
    
    orbitControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);