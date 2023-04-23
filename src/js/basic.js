import * as THREE from 'three';
import '../scss/style.scss';
import {GUI} from "dat.gui";
import stars from '../img/stars.jpg';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const modelRoute = '/models/monkey.glb';
const monkeyUrl = new URL(modelRoute, import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//renderer.setClearColor(0xFFEA00, 0.5); background color
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 20);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const assetLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// 2D background
// scene.background = textureLoader.load(stars);

// 3D background
scene.background = cubeTextureLoader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
]);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
scene.add(ambientLight);

// direct light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;
// directionalLight.shadow.camera.top = 12;
// scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(-100, 80, 0);
spotLight.castShadow = true;
scene.add(spotLight);

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// add helpers
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// const directionalShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalShadowHelper);

const gui = new GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.12,
    penumbra: 1,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange((e) => sphere.material.color.set(e));
gui.add(options, 'wireframe').onChange((e) => sphere.material.wireframe = e);
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-1, 2, 0);
box.receiveShadow = true;
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = 0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.set(-10, 10, 0);
scene.add(sphere);

const box2Geometry = new THREE.BoxGeometry(2, 2, 2);
const box2Material = new THREE.MeshBasicMaterial({
    //color: 0xFFFFFF,
    //map: textureLoader.load(nebula)
});

// single texture for all faces
//box2.material.map = textureLoader.load(nebula);

const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({color: 0xFF0000}),
    new THREE.MeshBasicMaterial({color: 0xFF0000}),
    new THREE.MeshBasicMaterial({color: 0xFF0000}),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF}),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF})
];

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
box2.position.set(6, 6, -4);
box2.name = 'box2';
scene.add(box2);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
plane2.position.set(10, 10, -14);
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
scene.add(plane2);

// passable to load model with regular route string
assetLoader.load(monkeyUrl.href, (gltf) => {
    const model = gltf.scene;
    model.position.set(5, 5, 0);
    scene.add(model);
}, undefined, (error) => console.log(error));

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * -2 + 1;
});
const rayCaster = new THREE.Raycaster();

let step = 0;
const animate = (time) => {
    
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();
    
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    
    intersects.forEach(intersect => {
        const obj = intersect.object;
        
        if (obj.uuid === sphere.uuid) {
            obj.material.color.set(0xFF0000);
        }
        
        if (obj.name === 'box2') {
            obj.rotation.x = time / 1000;
            obj.rotation.y = time / 1000;
        }
    });
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});