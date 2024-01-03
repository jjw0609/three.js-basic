import { Mesh } from 'three';
import { Sphere, Body, Vec3 } from 'cannon-es';

export class MySphere {
    constructor(info) {
        this.scene = info.scene;
        this.cannonWorld = info.cannonWorld;
        this.geometry = info.geometry;
        this.material = info.material;
        this.x = info.x;
        this.y = info.y;
        this.z = info.z;
        this.scale = info.scale;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.castShadow = true;
        this.mesh.position.set(this.x, this.y, this.z);
        this.scene.add(this.mesh);

        this.setCannonBody();
    }

    setCannonBody() {
        const shape = new Sphere(0.5 * this.scale);
        this.cannonBody = new Body({
            mass: 1,
            position: new Vec3(this.x, this.y, this.z),
            shape
        });

        this.cannonWorld.addBody(this.cannonBody);
    }
}