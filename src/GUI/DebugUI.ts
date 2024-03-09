import GUI from 'lil-gui';
import * as THREE from 'three';
import gsap from 'gsap'
import * as Values from '../Values/Static'
import { Clickable } from '@/Objects/Clickable_Object';
// interface GUIOptions {
//     width: number;
//     title: string;
//     closeFolders: boolean;
// }
interface debugO {
    color: string;
    subdivision: number;
    speed:number;
    spin: () => void;
}

//change to singleton
const gui = new GUI({
    width: 300,
    title: 'Nice debug UI',
    closeFolders: false
});

//figure out why this ownt spin
function addSpin(debugObject: any, mesh: THREE.Mesh): void {
    debugObject.spin = () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })

    }
}

export function GameDebug(folder: GUI, meshMap: Map<string,Clickable>,debugObject:debugO): void {
    folder
    .add(debugObject, 'speed')
    .min(0)
    .max(3)
    .step(0.01)
    .name('elevation')
    // .onChange(() => {
    //     for (const [key, value] of meshMap.entries()) 
    //         value.changeSpeed(debugObject.speed);

    // });

}

export function BasicDebug(folder: GUI, mesh: THREE.Mesh, material: THREE.MeshBasicMaterial): void {
    //will refactor this function to multipal function for each debug option
    //debugObject.color = Values.Colours.RED

    

    const debugObject: debugO = {
        color: Values.Colours.RED,
        subdivision: 2,
        speed: 0.02,
        spin: () => {
            gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
        }
    };
    folder
        .add(mesh.position, 'y')
        .min(- 3)
        .max(3)
        .step(0.01)
        .name('elevation');

    folder
        .add(mesh, 'visible');

    folder
        .add(material, 'wireframe');

    folder
        .addColor(debugObject, 'color')
        .onChange(() => {
            material.color.set(debugObject.color)
        });

    // addSpin(debugObject, mesh)
    debugObject.spin = () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })

    }
    folder
        .add(debugObject, 'spin');

    debugObject.subdivision = 2;

    folder
        .add(debugObject, 'subdivision')
        .min(1)
        .max(20)
        .step(1)
        .onFinishChange(() => {
            mesh.geometry.dispose()
            mesh.geometry = new THREE.BoxGeometry(
                1, 1, 1,
                debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
            )
        })
}

export function addFolder(Name: string): GUI {
    return gui.addFolder(Name);

}

export function Init(): void {
    const cubeTweaks = gui.addFolder("typescriptfolder")
    console.log("Hello, World!");
}