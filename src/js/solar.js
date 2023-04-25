import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {canvasResponsive} from "./helper.js";
import '../scss/style.scss';
import starsTexture from '../img/solar/stars.jpg';
import sunTexture from '../img/solar/sun.jpg';
import mercuryTexture from '../img/solar/mercury.jpg';
import venusTexture from '../img/solar/venus.jpg';
import earthTexture from '../img/solar/earth.jpg';
import marsTexture from '../img/solar/mars.jpg';
import jupiterTexture from '../img/solar/jupiter.jpg';
import saturnTexture from '../img/solar/saturn.jpg';
import saturnRingTexture from '../img/solar/saturn ring.png';
import uranusTexture from '../img/solar/uranus.jpg';
import uranusRingTexture from '../img/solar/uranus ring.png';
import neptuneTexture from '../img/solar/neptune.jpg';
import plutoTexture from '../img/solar/pluto.jpg';

const planets = {
    mercury: {
        size: [3.2, 30, 30],
        texture: mercuryTexture,
        position: 28,
        rotation: {
            aroundSun: 0.04,
            aroundSelf: 0.004
        }
    },
    saturn: {
        size: [10, 30, 30],
        texture: saturnTexture,
        position: 138,
        rotation: {
            aroundSun: 0.0009,
            aroundSelf: 0.038
        },
        rings: {
            size: [10, 20, 32],
            texture: saturnRingTexture,
            position: 138
        }
    }
}

const renderer = new THREE.WebGLRenderer({antialias: true});
const canvas = renderer.domElement;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 140, 140);
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.update();

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

const createPlanet = (planetSizes, planetTexture, planetPosition, planetRings = null) => {
    const planetObj = new THREE.Object3D();
    const planetGeometry = new THREE.SphereGeometry(...planetSizes);
    const planetMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load(planetTexture)});
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = planetPosition;
    planetObj.add(planet);
    
    if (planetRings) {
        console.log(...planetRings.size)
        const ringGeometry = new THREE.RingGeometry(...planetRings.size);
        const ringMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load(planetRings.texture), side: THREE.DoubleSide});
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.x = planetRings.position;
        ring.rotation.x = -0.5 * Math.PI;
        planetObj.add(ring);
    }
    
    scene.add(planetObj);
}

const planetRotations = (rotationObj) => {

}

for (let planet in planets) {
    const obj = planets[planet];
    createPlanet(obj.size, obj.texture, obj.position, obj.rings);
}

const animate = () => {
    sun.rotateY(0.004);
    
    // mercuryObj.rotateY(0.04);
    // mercury.rotateY(0.004);
    // saturn.rotateY(0.038);
    // saturnObj.rotateY(0.0009);
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
canvasResponsive(camera, renderer);



