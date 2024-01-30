import { Scene, PerspectiveCamera, Color } from 'three';

export class CreateScene {
    constructor(info) {
        this.renderer = info.renderer;
        this.elem = document.querySelector(info.placeholder);
        const rect = this.elem.getBoundingClientRect();

        const bgColor = info.bgColor || 'white';
        const fov = info.fov || 75;
        const aspect = rect.width / rect.height;
        const near = info.near || 0.1;
        const far = info.far || 100;
        const cameraPosition = info.cameraPosition || {x: 0, y: 0, z: 3};

        // scene
        this.scene = new Scene();
        this.scene.background = new Color(bgColor);

        // camera
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.x = cameraPosition.x;
        this.camera.position.y = cameraPosition.y;
        this.camera.position.z = cameraPosition.z;

        this.scene.add(this.camera);
    }
}