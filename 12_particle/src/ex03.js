import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 파티클 이미지

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
	controls.enableDamping = true;
	

	// Mesh
	const geometry = new THREE.BufferGeometry();
	const count = 1000;
	const positions = new Float32Array(count * 3);
	for(let i=0 ; i<positions.length ; i++) {
		positions[i] = (Math.random() - 0.5) * 10;
	}
	geometry.setAttribute(
		'position',
		new THREE.BufferAttribute(positions, 3)	// 1개의 Vertex(정점)를 위해 값 3개 필요
	);

	const textureLoader = new THREE.TextureLoader();
	const particleTexture = textureLoader.load('./images/star.png');

	const material = new THREE.PointsMaterial({
		size: 0.3,
		map: particleTexture,
		// 파티클 이미지를 투명하게 세팅
		transparent: true,
		alphaMap: particleTexture,
		depthWrite: false
	});
	const particles = new THREE.Points(geometry, material);
	scene.add(particles);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();

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
