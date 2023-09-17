import * as THREE from 'three';


export default function example() {
    // Renderer

    // 동적으로 캔버스 조립하기
    // const renderer = new THREE.WebGL1Renderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // html에서 캔버스 가져와서 사용하기
    const canvas = document.querySelector('#three-canvas');
    // const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,     // 시야각(field of view)
        window.innerWidth / window.innerHeight, // 종횡비(aspect)
        0.1,    // near
        1000    // far
    );
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        // color: 0xff0000
        // color: '#ff0000'
        color: 'red'
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 그리기
    renderer.render(scene, camera);
}

example();

