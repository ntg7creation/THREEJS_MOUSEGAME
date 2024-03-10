import * as THREE from 'three';


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

//we dont need this anymore
// export class ID_creator {
//     private static instance: ID_creator;
//     private callCount: number;

//     private constructor() {
//         this.callCount = 0;
//     }

//     public static getInstance(): ID_creator {
//         if (!ID_creator.instance) {
//             ID_creator.instance = new ID_creator();
//         }
//         return ID_creator.instance;
//     }


//     public getCallCount(): string {
//         return ("ID_" + this.callCount++);
//     }
// }