import * as THREE from "three";
import {TrackballControls} from "three/addons/controls/TrackballControls.js";
import {canvasResponsive} from "../helper.js";
import '../../scss/style.scss';
import starsTexture from '../../img/solar/stars.jpg';
import sunTexture from '../../img/solar/sun.jpg';
import {planetsData} from "./solarData.js";

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});
const canvas = renderer.domElement;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 140, 140);

const trackballControls = new TrackballControls(camera, canvas);
trackballControls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load(sunTexture)});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const createPlanet = (planetSize, planetTexture, planetPosition, planetRings = null) => {
    const planetObj = new THREE.Object3D();
    const planetGeometry = new THREE.SphereGeometry(planetSize, 30, 30);
    const planetMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load(planetTexture)});
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = planetPosition;
    planetObj.add(planet);
    
    if (planetRings) {
        const ringGeometry = new THREE.RingGeometry(...planetRings.size, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load(planetRings.texture), side: THREE.DoubleSide});
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.x = planetPosition;
        ring.rotation.x = -0.5 * Math.PI;
        planetObj.add(ring);
    }
    
    scene.add(planetObj);
    return {planet, planetObj};
}

const planets = {};
for (let planet in planetsData) {
    const obj = planetsData[planet];
    planets[planet] = createPlanet(obj.size, obj.texture, obj.position, obj.rings);
}

const animate = () => {
    sun.rotateY(0.004);

    for (let planet in planetsData) {
        const obj = planetsData[planet];
        planets[planet].planet.rotateY(obj.rotation.aroundSelf);
        planets[planet].planetObj.rotateY(obj.rotation.aroundSun);
    }
    
    trackballControls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);
