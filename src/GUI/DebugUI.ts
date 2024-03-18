import GUI from 'lil-gui';
import * as THREE from 'three';
import gsap from 'gsap'
import * as Values from '../Values/Static'
<<<<<<< HEAD
import { ClockSingleton } from '../GameFolder/Singleton';
=======
>>>>>>> d2ab3eb90b44f30328035126ad380e4453b31920


interface debugO {
    color: string;
    subdivision: number;
    speed:number;
    spin: () => void;
}

//not sure about the architecture here 
 export interface Config  {
    collectAmount: number;
    avoidAmount: number;
    changeAmount: number;
    speed:number;
}

export const config:Config = {
    collectAmount:3,
    avoidAmount:3,
    changeAmount:3,
    speed:0.02,
};

<<<<<<< HEAD
const actions = {
    puase():void{
       ClockSingleton.getInstance().getClock().running ? ClockSingleton.getInstance().getClock().stop() : ClockSingleton.getInstance().getClock().start();
    }
}

=======
>>>>>>> d2ab3eb90b44f30328035126ad380e4453b31920
// ? change to singleton
const gui = new GUI({
    width: 300,
    title: 'debug UI',
    closeFolders: false
});

//figure out why this ownt spin
function addSpin(debugObject: any, mesh: THREE.Mesh): void {
    debugObject.spin = () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })

    }
}

export function InitGameUI(): void {
   gui.add(config,'collectAmount',1,10,1);
   gui.add(config,'avoidAmount',1,10,1);
   gui.add(config,'changeAmount',1,10,1);
   gui.add(config,'speed',0.005,0.05);
<<<<<<< HEAD
   gui.add(actions, "puase")
=======
>>>>>>> d2ab3eb90b44f30328035126ad380e4453b31920
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

export function InitGui(): void {
    const cubeTweaks = gui.addFolder("typescriptfolder")
}