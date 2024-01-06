import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PreventDragClick';
import { Domino } from './Domino';

// ----- 주제: 도미노

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function example() {
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

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Loader
	const gltfLoader = new GLTFLoader();

	// Cannon(물리 엔진)
	const cannonWorld = new CANNON.World();
	cannonWorld.gravity.set(0, -10, 0);

	// 성능을 위한 세팅
	// cannonWorld.allowSleep = true;	// body가 엄청 느려지면, 테스트 안함
	cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
	// SAPBroadphase // 제일 좋음
	// NaiveBroadphase // 기본값
	// GridBroadphase // 구역을 나누어 테스트

	// Contact Material
	const defaultMaterial = new CANNON.Material('default');
	const rubberMaterial = new CANNON.Material('rubber');
	const ironMaterial = new CANNON.Material('iron');
	const defaultContactMaterial = new CANNON.ContactMaterial(
		defaultMaterial,
		defaultMaterial,
		{
			friction: 0.5,
			restitution: 0.3
		}
	);
	cannonWorld.defaultContactMaterial = defaultContactMaterial;

	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0 ,
		position: new CANNON.Vec3(0, 0, 0),
		shape: floorShape,
		material: defaultMaterial
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	);
	cannonWorld.addBody(floorBody);

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(100, 100),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = - Math.PI / 2;
	floorMesh.receiveShadow = true;
	scene.add(floorMesh);

	// 도미노 생성
	const dominos = [];
	let domino;
	for(let i=-3 ; i<17 ; i++) {
		domino = new Domino({
			scene,
			cannonWorld,
			gltfLoader,
			z: -i * 0.8,
		});
		dominos.push(domino);
	}

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		let cannoStepTime = 1/60;
		if(delta < 0.01) cannoStepTime = 1/120;
		cannonWorld.step(cannoStepTime, delta, 3);

		dominos.forEach(item => {
			if(item.cannonBody) {
				item.modelMesh.position.copy(item.cannonBody.position);
				item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
			}
		});

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	const sound = new Audio('./sounds/boing.mp3');

	// 이벤트
	window.addEventListener('resize', setSize);
	canvas.addEventListener('click', () => {

	});

	const preventDragClick = new PreventDragClick(canvas);

	draw();
}
