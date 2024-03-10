import * as THREE from 'three';
import * as TextureCode from './Textures'

/**
 * Creates a basic mesh material with the specified color.
 * 
 * @param color The color of the material. Defaults to blue (#0000FF) if not provided.
 * @returns A MeshBasicMaterial instance.
 */
export function createMat(color?: string): THREE.MeshBasicMaterial {
    let colour = '#0000FF';
    if (color)
        colour = color;

    return new THREE.MeshBasicMaterial({ color: colour, wireframe: false });
}

/**
 * Creates a mesh material with a texture representing the start state.
 * 
 * @param path The path to the texture image. Defaults to undefined if not provided.
 * @returns A MeshBasicMaterial instance with a start texture.
 */
export function createTextureMatStart(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureStart});
}

/**
 * Creates a mesh material with a texture representing the lose state.
 * 
 * @param path The path to the texture image. Defaults to undefined if not provided.
 * @returns A MeshBasicMaterial instance with a lose texture.
 */
export function createTextureMatLose(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureLose});
}
/**
 * Creates a mesh material with a texture representing the win state.
 * 
 * @param path The path to the texture image. Defaults to undefined if not provided.
 * @returns A MeshBasicMaterial instance with a win texture.
 */
export function createTextureMatWin(path?: string) {
    return  new THREE.MeshBasicMaterial({map: TextureCode.textureWin});
}