import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


/**
 * Singleton class for managing a clock instance.
 */
export class ClockSingleton {
    private static instance: ClockSingleton;
    private clock: THREE.Clock;

    private constructor() {
        this.clock = new THREE.Clock();
    }

    /**
     * Retrieves the singleton instance of the ClockSingleton class.
     * If an instance does not exist, it creates one.
     * 
     * @returns The singleton instance of ClockSingleton.
     */
    public static getInstance(): ClockSingleton {
        if (!ClockSingleton.instance) {
            ClockSingleton.instance = new ClockSingleton();
        }
        return ClockSingleton.instance;
    }
    
    /**
     * Gets the clock instance.
     * 
     * @returns The clock instance.
     */
    public getClock(): THREE.Clock {
        return this.clock;
    }
}


/**
 * Singleton class for managing a controls instance.
 */
export class Controls {
    private static instance: Controls;
    private controls: OrbitControls;

    private constructor(camera:THREE.Camera,canvas:HTMLElement ) {
        this.controls = new OrbitControls(camera,canvas)
        this.controls.enableDamping = true;
        this.controls.saveState();
    }

    /**
     * Retrieves the singleton instance of the Controls class.
     * If an instance does not exist, it creates one.
     * on first call init
     * 
     * @returns The singleton instance of Controls.
     */
    public static getInstance(camera?:THREE.Camera,canvas?:HTMLElement): Controls {
        if (!Controls.instance && camera && canvas) {
            Controls.instance = new Controls(camera,canvas);

        }
        // ? add if to make sure it was created
        return Controls.instance;
    }
    
    /**
     * Gets the Controls instance.
     * 
     * @returns The OrbitControls instance.
     */
    public getControls(): OrbitControls {
        return this.controls;
    }
}
