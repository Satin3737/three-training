import '../scss/style.scss';
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, window.innerHeight);
document.body.appendChild(renderer.domElement);