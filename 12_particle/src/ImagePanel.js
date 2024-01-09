import { MeshBasicMaterial, DoubleSide, Mesh } from 'three';


export class ImagePanel {
    constructor(info) {
        const texture = info.textureLoader.load(info.imageSrc);
        const material = new MeshBasicMaterial({
            map: texture,
            side: DoubleSide
        });

        this.mesh = new Mesh(info.geometry, material);
        this.mesh.position.set(info.x, info.y, info.z);
        this.mesh.lookAt(0, 0, 0);

        info.scene.add(this.mesh);
    }
}