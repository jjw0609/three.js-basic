import * as THREE from 'three';
import gsap from 'gsap';

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
    scene.fog = new THREE.Fog('black', 3, 7);

    // Camera
    const camera = new THREE.PerspectiveCamera(
         75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.y = 1;
    camera.position.z = 5;
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 5;
    scene.add(light);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 'red'
    });

    const meshes = [];
    let mesh;
    for(let i=0 ; i<10 ; i++) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 5 - 2.5;
        mesh.position.z = Math.random() * 5 - 2.5;
        scene.add(mesh);
        meshes.push(mesh);
    }

    // 그리기
    function draw() {
        meshes.forEach(item => {
            gsap.to(
                item.rotation,
                {
                    duration: 10,
                    y: 4,
                    z: 10
                }
            );

            gsap.to(
                item.position,
                {
                    duration: 10,
                    x: 2,
                    z: 1
                }
            );
        })

        renderer.render(scene, camera);

        // window.requestAnimationFrame(draw);
        renderer.setAnimationLoop(draw);
    }

    function setSize() {
        // 카메라
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener('resize', setSize);

    draw();
}
