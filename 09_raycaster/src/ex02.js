import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 클릭한 Mesh 선택하기

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
	camera.position.x = 5;
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

	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({color: 'plum'});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';

	const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({color: 'lime'});
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';

	scene.add(boxMesh, torusMesh);

	const meshes = [boxMesh, torusMesh];

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	console.log(mouse);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime();

		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;
		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function checkIntersects() {
		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(meshes);
		for(const item of intersects) {
			console.log(item.object.name);
			break;
		}

		// if(intersects[0]) {
		// 	console.log(intersects[0].object.name);
		// }
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);
	canvas.addEventListener('click', e => {
		console.log(e.clientX, e.clientY);
		mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
		mouse.y = - (e.clientY / canvas.clientHeight * 2 - 1);
		// console.log(mouse);
		checkIntersects();
	});

	draw();
}
