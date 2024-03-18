import * as THREE from 'three';
import * as myMat from './Mats/MaterialsFactory';
import * as myValues from '../Values/Static'

/**
 * Creates a mesh representing a sign with a texture.
 * 
 * @param texturePath The path to the texture image. Defaults to undefined if not provided.
 * @returns A Mesh representing a sign with the provided texture.
 */
export function createMeshSign(texturePath?:string):THREE.Mesh{
    return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),myMat.createTextureMatStart());
}

/**
 * Creates a mesh based on the specified shape, size, and color.
 * 
 * @param shape The shape of the mesh. Defaults to undefined if not provided.
 * @param size The size of the mesh. Defaults to undefined if not provided.
 * @param colour The color of the mesh material. Defaults to undefined if not provided.
 * @returns A Mesh representing the specified shape with the given size and color.
 */
export function createMesh(shape?: myValues.Shapes, size?: number, colour?: string): THREE.Mesh {

    switch (shape) {
        case myValues.Shapes.Box:
            console.log("created box");
            return new THREE.Mesh(createBox(size), myMat.createMat(colour));
            break;
        case myValues.Shapes.Sphere:
            console.log("created Sphere");
            return new THREE.Mesh(createSphere(size), myMat.createMat(colour));
            break;
        case myValues.Shapes.Pyramid:
            console.log("created Pyramid");
            return new THREE.Mesh(createPyramid(size), myMat.createMat(colour));
            break;
        case undefined:
        default:
            console.log("created defualt");
            return new THREE.Mesh(createPyramid(size), myMat.createMat(colour));
            break;
    }

    //return new THREE.Mesh(createBox(), myMat.createMat());;
}


/**
 * Creates a box geometry.
 * 
 * @param size The size of the box. Defaults to 1 if not provided.
 * @returns A BufferGeometry representing the box.
 */
function createBox(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.BoxGeometry(sized, sized, sized);
}

/**
 * Creates a sphere geometry.
 * 
 * @param size The size of the sphere. Defaults to 1 if not provided.
 * @returns A BufferGeometry representing the sphere.
 * @remarks A certain number of segments are used (32 longitudinal and 16 latitudinal) to ensure smooth appearance.
 */
function createSphere(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.SphereGeometry(sized, 32, 16);
}

/**
 * Creates a pyramid geometry.
 * 
 * @param size The size of the pyramid. Defaults to 1 if not provided.
 * @returns A BufferGeometry representing the pyramid.
 */
function createPyramid(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.TetrahedronGeometry(sized);
}

