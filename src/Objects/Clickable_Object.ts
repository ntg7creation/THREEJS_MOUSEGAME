import * as THREE from 'three';
import * as  MeshFactory from './SimpleMeshFactory'
import * as myValues from '../Values/Static'
import * as mySingels from '../GameFolder/Singleton'

export interface gameObserver {
    update(id: number, action:number): void;
}

export enum Clickables {
    Collect,    // 0
    Avoid,  // 1
    Change,    // 2
    startButton //3
}

//maybe I should extend mesh
export abstract class Clickable {
    abstract mesh: THREE.Mesh;
    // ID: string = mySingels.ID_creator.getInstance().getCallCount(); dont need this we have id in mesh
   // abstract changeSpeed(newspeed: number): void;
    abstract Behaviour(): void;//can set this to recive an action
    abstract wasClicked(): void;
}


export function ClickableFactory(type: Clickables,size?:number,pos?:THREE.Vector3,observer?:gameObserver): Clickable {
    switch (type) {
        case Clickables.Collect:
            return new Collect(size,observer);
        case Clickables.Avoid:
            return new Avoid(size,observer);
        case Clickables.Change:
            return new Change(size,pos,observer);
        default:
            return new Collect(size,observer);
            break;
    }
}

class Collect extends Clickable {
    observer?:gameObserver;
    mesh: THREE.Mesh;
    speed: THREE.Vector3 = new THREE.Vector3(0.02, 0, 0);
    changeTime: number = 2;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
    constructor(size?: number,observer?:gameObserver) {
        super();
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Box, size, myValues.Colours.GREEN);
        this.observer=observer;
    }
    Behaviour(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time;
            this.speed.set(-this.speed.y, -this.speed.z, -this.speed.x);//change deriction 
            //console.log("mesh collect change dirction");
        }
        this.mesh.position.add(this.speed);
    }
    wasClicked(): void {
        console.log("Collected click")
        this.observer?.update(this.mesh.id,Clickables.Collect)
    }
}

class Avoid extends Clickable {
    observer?:gameObserver;
    mesh: THREE.Mesh;
    speed: THREE.Vector3 = new THREE.Vector3(0.02, 0, 0);
    changeTime: number = 3;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();

    constructor(size?: number,observer?:gameObserver) {
        super();
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Sphere, size, myValues.Colours.RED);
        this.observer=observer;
    }

    Behaviour(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time;
            this.speed.multiplyScalar(-1);//change deriction 
           // console.log("mesh avoid change dirction");
        }
        this.mesh.position.add(this.speed);
    }
    wasClicked(): void {
        this.observer?.update(this.mesh.id,Clickables.Avoid )
    }
}

class Change extends Clickable {
    observer?:gameObserver;
    mesh: THREE.Mesh;
    speed: number = -0.5;
    changeTime: number = 4;
    starttime: number = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
    axis:THREE.Vector3;
    radios:number;
    rotationAxis = new THREE.Vector3(0,0,1);
    state:boolean = false; // represent if red or green false = red
    //TODO check ? is correct in this case
    constructor(size?: number,pos?:THREE.Vector3,observer?:gameObserver) {
        super();
        if(pos)
            this.axis = pos;
        else
            this.axis = new THREE.Vector3(0,0,-1);
        this.mesh = MeshFactory.createMesh(myValues.Shapes.Pyramid, size, myValues.Colours.RED);
        this.radios = ((size??1) *2);
        this.mesh.position.set(this.axis.x,this.axis.y+this.radios,this.axis.z)
        this.observer=observer;
    }

    Behaviour(): void {
        
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        //translate to 0,0,0
        this.mesh.position.sub(this.axis);

        //rotate around 0,0,0 aound the z axis
        //TODO find the correct function to rotate
        this.mesh.position.set(this.radios * Math.cos(time*this.speed),this.radios * Math.sin(this.speed*time),0)

        //send back to loction
        this.mesh.position.add(this.axis);

        if (time - this.starttime > this.changeTime) // elapsed time
        {
            this.starttime = time; // wihtout this code runs fast I see yellow while its really only green and red
            if(this.state){
                this.state=false;
                if (this.mesh.material instanceof THREE.MeshBasicMaterial) { //TODO find better soltions
                    (this.mesh.material as THREE.MeshBasicMaterial).color.set(myValues.Colours.RED);
                }

            }
            else{
                this.state=true;
                if (this.mesh.material instanceof THREE.MeshBasicMaterial) { //TODO find better soltions
                    (this.mesh.material as THREE.MeshBasicMaterial).color.set(myValues.Colours.GREEN);
                }
            }
        }

    }
    //in genral im should implement observer pattern here in a way that he gets the Observer else where and this is kind of usless
    wasClicked(): void {
        this.observer?.update(this.mesh.id,this.state ? Clickables.Collect:Clickables.Avoid )
    }
}

export class ButtonMesh extends Clickable{
    mesh: THREE.Mesh = MeshFactory.createMeshSign();
    observer?:gameObserver;
    constructor(size?: number,pos?:THREE.Vector3,observer?:gameObserver) {
        super();
        this.observer = observer;
    }
    Behaviour(): void {
        throw new Error('Method not implemented.');
    }
    wasClicked(): void {
        console.log("button click")
        this.observer?.update(this.mesh.id,Clickables.startButton)

    }

}
