import * as THREE from 'three';
import * as myMat from './Mats/MaterialsFactory';
import * as myValues from '../Values/Static'


export function createMeshSign(texturePath?:string):THREE.Mesh{
    return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),myMat.createTextureMatStart());
}

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



function createBox(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.BoxGeometry(sized, sized, sized);
}

function createSphere(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.SphereGeometry(sized, 32, 16);
    //need to be a certain number of segments to make it look good
}

function createPyramid(size?: number): THREE.BufferGeometry {
    let sized = 1;
    if (size)
        sized = size;
    return new THREE.TetrahedronGeometry(sized);
}

