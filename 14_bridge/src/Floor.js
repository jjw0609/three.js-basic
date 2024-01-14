import { cm1, geo, mat } from './common';
import { Mesh } from 'three';
import { Stuff } from './Stuff';

export class Floor extends Stuff {
    constructor(info) {
        super(info);

        this.geometry = geo.floor;
        this.material = mat.floor;

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(this.x, this.y, this.x);
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        cm1.scene.add(this.mesh);
    }
}