import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

// ----- 주제: cannon.js 기본 세팅

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
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Cannon(물리 엔진)
	const cannonWorld = new CANNON.World();
	cannonWorld.gravity.set(0, -10, 0);

	const floorShape = new CANNON.Plane();
	const floorBody = new CANNON.Body({
		mass: 0 ,
		position: new CANNON.Vec3(0, 0, 0),
		shape: floorShape
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	);
	cannonWorld.addBody(floorBody);

	const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25));
	const boxBody = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 10, 0),
		shape: boxShape
	});
	cannonWorld.addBody(boxBody);

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = - Math.PI / 2;
	scene.add(floorMesh);

	const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
	const boxMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.y = 0.5;
	scene.add(boxMesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		let cannoStepTime = 1/60;
		if(delta < 0.01) cannoStepTime = 1/120;
		cannonWorld.step(cannoStepTime, delta, 3);

		boxMesh.position.copy(boxBody.position);	// 위치
		boxMesh.quaternion.copy(boxBody.quaternion);	// 회전

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
}
