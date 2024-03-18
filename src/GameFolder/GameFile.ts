import * as THREE from "three";
import * as mySingels from '../GameFolder/Singleton'
import * as myMat from '../Objects/Mats/MaterialsFactory';
import { ButtonMesh, Clickable, ClickableFactory, Clickables, gameObserver } from '../Objects/Clickable_Object'
import {Config,config} from '../GUI/DebugUI'



/**
 * Class representing the mouse game.
 */
export class MouseGame implements gameObserver {


    public gameValues:Config = config;
    private meshMap: Map<number, Clickable> = new Map<number, Clickable>();
    private scene: THREE.Scene;
    private start_sign = new ButtonMesh(undefined, undefined, this);//new THREE.PlaneGeometry(6, 2);
    private camera: THREE.PerspectiveCamera;
    private score = 0;
    private scoreElement: HTMLElement;
    private timerElement: HTMLElement;
    private highLightArr: THREE.Mesh[] | undefined;

    /**
     * Constructs a new MouseGame object.
     * 
     * @param scene The scene of the game.
     * @param camera The camera of the game.
     * @param scoreElement The element to display the score.
     * @param timerElement The element to display the timer.
     */
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, scoreElement: HTMLElement, timerElement: HTMLElement,highLightArr?:THREE.Mesh[]) {
        this.scene = scene;
        this.camera = camera;// not sure we should lower camera here 
        this.scene.add(this.start_sign.mesh)
        this.scoreElement = scoreElement;
        this.timerElement = timerElement;
        this.highLightArr = highLightArr;
    }

    /**
     * Updates the score display.
     */
    private updateScore(): void {
        this.scoreElement.innerText = this.score.toString();
    }

    /**
     * Handles updates from clickable objects.
     * 
     * @param id The ID of the object.
     * @param action The action performed.
     */
    public update(id: number, action: number): void {
        console.log("update action")
        switch (action) {
            case Clickables.Collect:
                this.score++;
                this.updateScore();
                if (this.meshMap.get(id))
                    (this.meshMap.get(id) as Clickable).mesh.visible = false; // maybe delete
                if (this.score == this.gameValues.changeAmount + this.gameValues.collectAmount) {
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

    /**
     * Starts the game.
     */
    private startGame(): void {
        //get new config values
        this.gameValues = config
        //craete objects 
        mySingels.ClockSingleton.getInstance().getClock().start();
        this.score = 0;
        this.updateScore();
        for (let index = 0; index < this.gameValues.collectAmount; index++) {
            const tempCollect: Clickable = ClickableFactory(Clickables.Collect, getRandomNumberInRange(0.1, 3), undefined, this);
            this.meshMap.set(tempCollect.mesh.id, tempCollect);
            tempCollect.mesh.position.set(getRandomNumberInRange(-10, 10), 1, getRandomNumberInRange(-1, -30));
            console.log("collect id:" + tempCollect.mesh.id);
            this.scene.add(tempCollect.mesh);
            // ! test highlight
            this.highLightArr?.push(tempCollect.mesh);
            for (let setstart = getRandomNumberInRange(0,6); setstart > 0; setstart--) {
                tempCollect.starttime = -10;
                tempCollect.Behaviour()
            }

        }
        for (let index = 0; index < this.gameValues.avoidAmount; index++) {
            const tempAvoid: Clickable = ClickableFactory(Clickables.Avoid, getRandomNumberInRange(0.1, 3), undefined, this);
            this.meshMap.set(tempAvoid.mesh.id, tempAvoid);
            tempAvoid.mesh.position.set(getRandomNumberInRange(-10, 10), 1, getRandomNumberInRange(-3, -30));
            console.log("avoid id:" + tempAvoid.mesh.id);
            this.scene.add(tempAvoid.mesh);
            for (let setstart = getRandomNumberInRange(0,6); setstart > 0; setstart--) {
                tempAvoid.starttime = -10;
                tempAvoid.Behaviour()
            }
        }
        for (let index = 0; index < this.gameValues.changeAmount; index++) {
            const tempChange: Clickable = ClickableFactory(Clickables.Change,
                getRandomNumberInRange(0.1, 3), // size
                new THREE.Vector3(getRandomNumberInRange(-10, 10), getRandomNumberInRange(-2, 2), getRandomNumberInRange(-3, -30)),// pos
                this);//observer
            this.meshMap.set(tempChange.mesh.id, tempChange);
            console.log("avoid id:" + tempChange.mesh.id);
            this.scene.add(tempChange.mesh);
            for (let setstart = getRandomNumberInRange(0,4); setstart > 0; setstart--) {
                tempChange.starttime = -10;
                tempChange.Behaviour()
            }

        }
        this.start_sign.mesh.visible = false;
    }

    /**
     * Stops the game.
     */
    private stopGame(): void {
        mySingels.ClockSingleton.getInstance().getClock().stop();
        for (let C of this.meshMap.values()) {
            this.scene.remove(C.mesh);
            // recreate meshMap I dont know if this will cose memory leak
        }
        this.start_sign.mesh.visible = true;

        // resets camera 
        mySingels.Controls.getInstance().getControls().reset();
    }

    //should be a better way to send the click down
    /**
     * Handles click events.
     * 
     * @param id The ID of the clicked object.
     */
    public click(id: number) {
        this.meshMap.get(id)?.wasClicked() // move this into the null below
        this.start_sign.mesh.id == id ? this.start_sign.wasClicked() : null;
    }

    /**
     * Restarts the game.
     */
    public restartGame(): void {
        this.stopGame();
        this.startGame();
    }

    /**
     * This function represents a game tick, 
     * it updates the timer element on the screen with the elapsed time and 
     * executes the behavior of all clickable objects if the start sign is not visible (the game is in play).
     */
    public tick(): void {
        let time = mySingels.ClockSingleton.getInstance().getClock().getElapsedTime();
        mySingels.Controls.getInstance().getControls().update();

        this.timerElement.innerText = time.toFixed(1).toString();
        if (!this.start_sign.mesh.visible)
            for (let C of this.meshMap.values())
                C.Behaviour();

    }
}


//TODO move to utils
/**
 * Generates a random number within the specified range.
 * 
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A random number within the range.
 */
function getRandomNumberInRange(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}




