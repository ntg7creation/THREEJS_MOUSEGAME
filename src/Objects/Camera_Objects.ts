
import * as THREE from 'three';

/**
 * Creates a perspective camera and adds it to the scene.
 * 
 * @param scene The scene to which the camera will be added.
 * @param width The width of the viewport.
 * @param height The height of the viewport.
 * @returns A PerspectiveCamera instance.
 */
export function createCamera( width: number, height: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1
    return camera
}