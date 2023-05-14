import * as THREE from 'three';
import gsap from 'gsap';
import '../scss/style.scss';
import {canvasResponsive} from "./helper.js";

console.log(gsap);

const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);


const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xFF0000})
);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00FF00})
);
cube2.position.x = -2;

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x0000FF})
);
cube3.position.x = 2;

group.add(cube1);
group.add(cube2);
group.add(cube3);

group.position.set(4, 0, -1);
group.scale.y = 0.5;
group.rotation.z = Math.PI * 0.5;

const cube4 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xFFFF00})
);
scene.add(cube4);

const cube5 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xFFFFFF})
);
cube5.position.x = -2;
scene.add(cube5);

gsap.to(cube4.position, {
    x: 2,
    duration: 1,
    delay: 1
});

gsap.to(cube4.position, {
    x: 0,
    duration: 1,
    delay: 2
});

const clock = new THREE.Clock();
const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    cube5.rotation.y = elapsedTime * Math.PI * 2;
    cube5.rotation.z = elapsedTime * Math.PI * 2;
    
    camera.position.y = Math.sin(elapsedTime);
    camera.position.x = Math.cos(elapsedTime);
    camera.lookAt(cube4.position);
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();
canvasResponsive(camera, renderer);
