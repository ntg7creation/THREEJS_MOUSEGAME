import * as THREE from 'three';
import * as TextureCode from './Textures'

export function createMat(color?: string): THREE.MeshBasicMaterial {
    let colour = '#0000FF';
    if (color)
        colour = color;

    return new THREE.MeshBasicMaterial({ color: colour, wireframe: false });
}

export function createTextureMatStart(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureStart});
}
export function createTextureMatLose(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureLose});
}
export function createTextureMatWin(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureWin});
}