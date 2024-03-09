import * as THREE from "three";
import * as mySingels from '../GameFolder/Singleton'
import * as myMat from '../Objects/Mats/MaterialsFactory';
import { ButtonMesh, Clickable, ClickableFactory, Clickables, gameObserver } from '../Objects/Clickable_Object'



function getRandomNumberInRange(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

export class MouseGame implements gameObserver {
    private meshMap: Map<number, Clickable> = new Map<number, Clickable>();
    private scene: THREE.Scene;
    private start_sign = new ButtonMesh(undefined,undefined,this);//new THREE.PlaneGeometry(6, 2);
    private camera: THREE.PerspectiveCamera;
    private collectamount: number = 3;
    private avoidamount: number = 3;
    private changeamount: number = 3;
    private score = 0;
    private scoreElement:HTMLElement;
    private timerElement:HTMLElement;
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera,scoreElement:HTMLElement,timerElement:HTMLElement) {
        this.scene = scene;
        this.camera = camera;// not sure we should lower camera here 
        this.scene.add(this.start_sign.mesh)
        this.scoreElement = scoreElement;
        this.timerElement = timerElement;
        /**
         * Create objects
         */
        //this creates 1 object

        //this.startGame();
        //mySingels.ClockSingleton.getInstance().getClock().stop();
    }

    private updateScore():void{
        this.scoreElement.innerText = this.score.toString();
    }
    public update(id: number, action: number): void {
        console.log("update action")
        switch (action) {
            case Clickables.Collect :
                this.score++;
                this.updateScore();
                if(this.meshMap.get(id))
                    (this.meshMap.get(id)as Clickable).mesh.visible = false; // maybe delete
                if(this.score == this.avoidamount + this.collectamount)
                {
                    this.start_sign.mesh.material = myMat.createTextureMatWin();
                    this.stopGame();
                }

                break;
            case Clickables.Avoid:
                //game over
                this.start_sign.mesh.material = myMat.createTextureMatLose();
                this.stopGame();
                break;
            case Clickables.startButton:
                console.log("game start");
                this.startGame();
            default:
                break;
        }
    }

    private startGame(): void {
        mySingels.ClockSingleton.getInstance().getClock().start();
        this.score = 0;
        this.updateScore();
        for (let index = 0; index < this.collectamount; index++) {
            const tempCollect: Clickable = ClickableFactory(Clickables.Collect, getRandomNumberInRange(0.1, 3),undefined,this);
            this.meshMap.set(tempCollect.mesh.id, tempCollect);
            tempCollect.mesh.position.set(getRandomNumberInRange(-10, 10), 1, getRandomNumberInRange(-1, -30));
            console.log("collect id:" + tempCollect.mesh.id);
            this.scene.add(tempCollect.mesh);
        }
        for (let index = 0; index < this.avoidamount; index++) {
            const tempAvoid: Clickable = ClickableFactory(Clickables.Avoid, getRandomNumberInRange(0.1, 3),undefined,this);
            this.meshMap.set(tempAvoid.mesh.id, tempAvoid);
            tempAvoid.mesh.position.set(getRandomNumberInRange(-10, 10), 1, getRandomNumberInRange(-3, -30));
            console.log("avoid id:" + tempAvoid.mesh.id);
            this.scene.add(tempAvoid.mesh);
        }
        for (let index = 0; index < this.changeamount; index++) {
            const tempChange: Clickable = ClickableFactory(Clickables.Change, 
                getRandomNumberInRange(0.1, 3), // size
                new THREE.Vector3(getRandomNumberInRange(-10, 10),getRandomNumberInRange(-2, 2),getRandomNumberInRange(-3, -30)),// pos
                this);//observer
            this.meshMap.set(tempChange.mesh.id, tempChange);
            console.log("avoid id:" + tempChange.mesh.id);
            this.scene.add(tempChange.mesh);
        }
        this.start_sign.mesh.visible = false;
    }

    private stopGame(): void {
        mySingels.ClockSingleton.getInstance().getClock().stop();
        for (let C of this.meshMap.values()) {
            this.scene.remove(C.mesh);
         // recreate meshMap I dont know if this will cose memory leak
        }
        this.start_sign.mesh.visible = true;
        this.camera.position.set(0,0,1); //reset camera - its not resting as I want still have an angel
        this.camera.rotation.set(0,0,-1);
        this.camera.lookAt(this.start_sign.mesh.position);

    }
    
    //should be a better way to send the click down
    public click(id: number) {
        this.meshMap.get(id)?.wasClicked()
        this.start_sign.mesh.id == id ? this.start_sign.wasClicked() : null;
    }

    public restartGame(): void {
        this.stopGame();
        this.startGame();
    }

    public tick(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        
        this.timerElement.innerText = time.toString();
        if (!this.start_sign.mesh.visible)
            for (let C of this.meshMap.values())
                C.Behaviour();

    }
}






