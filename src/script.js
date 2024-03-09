import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as myCameras from "./Objects/Camera_Objects";
import * as Games from "./GameFolder/GameFile";

// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('/textures/starttexture.png', () =>
// {
//     console.log('loading finished')
// },
// () =>
// {
//     console.log('loading progressing')
// },
// () =>
// {
//     console.log('loading error')
// })
// texture.colorSpace = THREE.SRGBColorSpace
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({map: texture});
// const tempmesh = new THREE.Mesh(geometry,material);

const scoreElement = document.getElementById("score-value");
const timerElement = document.getElementById("timer-value");
var axisID = -1;
class screen {
  constructor(canvas) {
    // Canvas - get it on constrution
    this.canvas = canvas;
    // Scene
    this.scene = new THREE.Scene();
    // Sizes
    this.sizes = { width: window.innerWidth, height: window.innerHeight };
    this.InitAll();
    console.log("screen was constructed");
  }

  InitCamera() {
    // Camera
    this.camera = myCameras.createCamera(
      this.scene,
      this.sizes.width,
      this.sizes.height
    );
  }

  InitControls() {
    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

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

  InitRender() {
    //create Render object
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  InitGame() {
    this.axesHelper = new THREE.AxesHelper( 5 );// to help
    axisID = this.axesHelper.id;
    console.log("axis id : " + this.axesHelper.id)
    this.scene.add( this.axesHelper );
    //create the game object
    this.Game = new Games.MouseGame(this.scene, this.camera, scoreElement,timerElement);
  }

  InitAll() {
    this.InitCamera();
    this.InitControls();
    this.InitGame();
    this.InitRender();
    this.InitWindow();
  }

  tick = () => {
    //const elapsedTime = clock.getElapsedTime();

    // Update controls
    this.controls.update();

    //Give Game tick
    this.Game.tick();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick);

    //console.log(coolclock.getElapsedTime());
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
    if (intersect.id != axisID & intersect.visible) {
      // Do something with the intersected object
      console.log("click on :" + intersect.id);
      myscreen.Game.click(intersect.id);
      break;
    }
  }
}

window.addEventListener("click", onMouseClick);
