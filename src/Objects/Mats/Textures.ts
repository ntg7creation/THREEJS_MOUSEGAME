import * as THREE from "three";



const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
export const textureStart = textureLoader.load('/textures/starttexture.png')
textureStart.colorSpace = THREE.SRGBColorSpace

export const textureWin = textureLoader.load('/textures/winscreen.png')
textureWin.colorSpace = THREE.SRGBColorSpace

export const textureLose = textureLoader.load('/textures/losescreen.png')
textureLose.colorSpace = THREE.SRGBColorSpace