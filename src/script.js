import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as myCameras from "./Objects/Camera_Objects";
import * as Games from "./GameFolder/GameFile";

const scoreElement = document.getElementById("score-value");
const timerElement = document.getElementById("timer-value");
var axisID = -1;

/**
 * Represents the screen and manages the setup of the 3D environment, including the camera, controls, renderer, and game logic.
 * It also provides the main game loop for updating and rendering the scene.
 */
class screen {
  constructor(canvas) {
    // Canvas - get it on constrution
    this.canvas = canvas;
    // Scene
    this.scene = new THREE.Scene();
    // Sizes
    this.sizes = { width: window.innerWidth, height: window.innerHeight };
    // Initialize all components
    this.InitAll();
    console.log("screen was constructed");
  }

  // Initializes the camera
  InitCamera() {
    this.camera = myCameras.createCamera(
      this.scene,
      this.sizes.width,
      this.sizes.height
    );
  }
  // Initializes the camera
  InitControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  // Initializes the window resize event listener
  InitWindow() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // Initializes the renderer
  InitRender() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Initializes the game logic
  InitGame() {
     // Create axes helper for better field of view
    this.axesHelper = new THREE.AxesHelper(5); 
    axisID = this.axesHelper.id;
    console.log("axis id : " + this.axesHelper.id);
    this.scene.add(this.axesHelper);

    // Initialize the game object
    this.Game = new Games.MouseGame(
      this.scene,
      this.camera,
      scoreElement,
      timerElement
    );
  }

  // Initializes all components
  InitAll() {
    this.InitCamera();
    this.InitControls();
    this.InitGame();
    this.InitRender();
    this.InitWindow();
  }

  // Game tick function
  tick = () => {
    //const elapsedTime = clock.getElapsedTime(); // can ensure a game only tick 60 per sec

    // Update controls
    this.controls.update();

    //Give Game tick
    this.Game.tick();

    // Render 
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick);

  };
}

// get the Canvas
const canvas = document.querySelector("canvas.webgl");
// create a screen that will display on the canvas
const myscreen = new screen(canvas);
myscreen.tick();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from the camera through the mouse position
  raycaster.setFromCamera(pointer, myscreen.camera);

  // Find intersected objects
  const intersects = raycaster.intersectObjects(myscreen.scene.children, true);

  for (let i = 0; i < intersects.length; i++) {
    const intersect = intersects[i].object;

    // Check if the intersected object is visible
    if ((intersect.id != axisID) & intersect.visible) {
      // Do something with the intersected object
      console.log("click on :" + intersect.id);
      myscreen.Game.click(intersect.id);
      break;
    }
  }
}

window.addEventListener("click", onMouseClick);
