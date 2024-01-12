import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { House } from './House';

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.y = 1.5;
camera.position.z = 4;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white', 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

// Mesh
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({color: 'skyblue'})
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const houses = [];
houses.push(new House({	gltfLoader, scene, modelSrc: './models/house.glb',	x: 0, z: 0, height: 2 }));

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();
