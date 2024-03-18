import * as THREE from 'three';
import * as  MeshFactory from './SimpleMeshFactory'
import * as myValues from '../Values/Static'
import * as mySingels from '../GameFolder/Singleton'

const yaxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

/**
 * Interface for observing game events.
 */
export interface gameObserver {
    /**
     * Updates the observer with the specified ID of the subject and action to be taken. can be change to send Clickable class instead
     * 
     * @param id The ID of the object.
     * @param action The action performed.
     */
    update(id: number, action: number): void;
}

/**
 * Enum representing different types of clickable objects.
 */
export enum Clickables {
    Collect,    // 0
    Avoid,  // 1
    Change,    // 2
    startButton //3
}

//maybe I should extend mesh
/**
 * Abstract class representing a clickable object in the scene.
 */
export abstract class Clickable {
    abstract mesh: THREE.Mesh;
    abstract speed: THREE.Vector3;
    abstract starttime:number;
    abstract Behaviour(): void;
    abstract wasClicked(): void;
}

/**
 * Factory function to create clickable objects based on the specified type.
 * 
 * @param type The type of clickable object to create.
 * @param size The size of the object. Defaults to undefined if not provided.
 * @param pos The position of the object. Defaults to undefined if not provided.
 * @param observer The observer for the object. Defaults to undefined if not provided.
 * @returns A clickable object of the specified type.
 */
export function ClickableFactory(type: Clickables, size?: number, pos?: THREE.Vector3, observer?: gameObserver): Clickable {
    switch (type) {
        case Clickables.Collect:
            return new Collect(size, observer);
        case Clickables.Avoid:
            return new Avoid(size, observer);
        case Clickables.Change:
            return new Change(size, pos, observer);
        default:
            return new Collect(size, observer);
            break;
    }
}

/**
 * Represents a collectible object in the scene.
 * Inherits from Clickable class.
 */
class Collect extends Clickable {
    observer?: gameObserver;
    mesh: THREE.Mesh;
    speed: THREE.Vector3 = new THREE.Vector3(0.02, 0, 0);
    changeTime: number = 2;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();

    /**
     * Constructs a new Collect object.
     * 
     * @param size The size of the object. Defaults to undefined if not provided.
     * @param observer The observer for the object. Defaults to undefined if not provided.
     */
    constructor(size?: number, observer?: gameObserver) {
        super();
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Box, size, myValues.Colours.GREEN);
        this.observer = observer;
    }

    /**
     * Defines the behavior of the collectible object.
     */
    Behaviour(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time;
            this.speed.set(-this.speed.y, -this.speed.z, -this.speed.x);//change deriction 
            //console.log("mesh collect change dirction");
        }
        this.mesh.position.add(this.speed);
        this.mesh.rotateOnAxis(this.speed.clone().normalize(),Math.abs(this.speed.x + this.speed.y + this.speed.z));
    }
    /**
     * Handles click event on the collectible object.
     * Notifies the observer about the click.
     */
    wasClicked(): void {
        console.log("Collected click")
        this.observer?.update(this.mesh.id, Clickables.Collect)
    }
}

class Avoid extends Clickable {
    observer?: gameObserver;
    mesh: THREE.Mesh;
    speed: THREE.Vector3 = new THREE.Vector3(0.02, 0, 0);
    changeTime: number = 3;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();

    /**
     * Constructs a new Collect object.
     * 
     * @param size The size of the object. Defaults to undefined if not provided.
     * @param observer The observer for the object. Defaults to undefined if not provided.
     */
    constructor(size?: number, observer?: gameObserver) {
        super();
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Sphere, size, myValues.Colours.RED);
        this.observer = observer;
    }

    /**
     * Defines the behavior of the collectible object.
     */
    Behaviour(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time;
            this.speed.multiplyScalar(-1);//change deriction 
            // console.log("mesh avoid change dirction");
        }
        this.mesh.position.add(this.speed);
        this.mesh.rotateOnAxis(yaxis,this.speed.x)
    }

    /**
     * Handles click event on the collectible object.
     * Notifies the observer about the click.
     */
    wasClicked(): void {
        this.observer?.update(this.mesh.id, Clickables.Avoid)
    }
}

class Change extends Clickable {
    observer?: gameObserver;
    mesh: THREE.Mesh;
    speed: THREE.Vector3 = new THREE.Vector3(-0.5, 0, 0);
    changeTime: number = 4;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
    axis: THREE.Vector3;
    radios: number;
    rotationAxis = new THREE.Vector3(0, 0, 1);
    state: boolean = false; // represent if red or green false = red 

    constructor(size?: number, pos?: THREE.Vector3, observer?: gameObserver) {
        super();
        if (pos)
            this.axis = pos;
        else
            this.axis = new THREE.Vector3(0, 0, -1);
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Pyramid, size, myValues.Colours.RED);
        this.radios = ((size ?? 1) * 2);
        this.mesh.position.set(this.axis.x, this.axis.y + this.radios, this.axis.z)
        this.observer = observer;
    }

    Behaviour(): void {

        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        //translate to 0,0,0
        this.mesh.position.sub(this.axis);

        //rotate around 0,0,0 aound the z axis
        //TODO find the correct function to rotate
        this.mesh.position.set(this.radios * Math.cos(time * this.speed.x), this.radios * Math.sin(this.speed.x * time), 0)

        //send back to loction
        this.mesh.position.add(this.axis);
        this.mesh.rotateOnAxis(this.speed.clone().normalize(),Math.abs(this.speed.x + this.speed.y + this.speed.z)/10);
   
        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time; // wihtout this code runs fast I see yellow while its really only green and red
            if (this.state) {
                this.state = false;
                if (this.mesh.material instanceof THREE.MeshBasicMaterial) { //TODO find better soltions
                    (this.mesh.material as THREE.MeshBasicMaterial).color.set(myValues.Colours.RED);
                }

            }
            else {
                this.state = true;
                if (this.mesh.material instanceof THREE.MeshBasicMaterial) { //TODO find better soltions
                    (this.mesh.material as THREE.MeshBasicMaterial).color.set(myValues.Colours.GREEN);
                }
            }
        }

    }
    //in genral im should implement observer pattern here in a way that he gets the Observer else where and this is kind of usless
    wasClicked(): void {
        this.observer?.update(this.mesh.id, this.state ? Clickables.Collect : Clickables.Avoid)
    }
}

export class ButtonMesh extends Clickable {
    
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
    speed: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    mesh: THREE.Mesh = MeshFactory.createMeshSign();
    observer?: gameObserver;

    /**
     * Constructs a new ButtonMesh object.
     * 
     * @param size The size of the button. Defaults to undefined if not provided.
     * @param pos The position of the button. Defaults to undefined if not provided.
     * @param observer The observer for the button. Defaults to undefined if not provided.
     */
    constructor(size?: number, pos?: THREE.Vector3, observer?: gameObserver) {
        super();
        this.observer = observer;
    }

    /**
     * Defines the behavior of the collectible object.
     */
    Behaviour(): void {
        throw new Error('Method not implemented.');
    }

    /**
     * Handles click event on the collectible object.
     * Notifies the observer about the click.
     */
    wasClicked(): void {
        console.log("button click")
        this.observer?.update(this.mesh.id, Clickables.startButton)

    }

}
