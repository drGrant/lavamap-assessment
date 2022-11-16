import * as THREE from 'three'
import { ColorPicker } from './com/colorPicker.js'
import { CameraController } from './com/cameraController.js'
import { SceneController } from './com/sceneController.js'

export const appFunctions = () => {
  const threeViewport = document.querySelector('#threeViewport')
  const resetButton = document.querySelector('#reset')
  const upButton = document.querySelector('#up')
  const rightButton = document.querySelector('#right')
  const downButton = document.querySelector('#down')
  const leftButton = document.querySelector('#left')
  const bounds = 600
  let scene, sceneController, renderer, camera, cameraController

  const initializeScene = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeeeeee)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(threeViewport.clientWidth, threeViewport.clientHeight)
    threeViewport.appendChild(renderer.domElement)

    const cameraControllerGroup = new THREE.Group()
    cameraControllerGroup.position.set(0, 0, 0)
    scene.add(cameraControllerGroup)

    camera = new THREE.PerspectiveCamera(
      30,
      threeViewport.clientWidth / threeViewport.clientHeight,
      1,
      10000
    )
    camera.position.set(0, 1500, 0)
    camera.rotation.x = -Math.PI / 2
    cameraControllerGroup.add(camera)

    const gridHelper = new THREE.GridHelper(bounds * 2, 20)
    scene.add(gridHelper)
    gridHelper.position.y = 0.1

    const planeGeo = new THREE.PlaneGeometry(bounds * 2, bounds * 2, 10)
    const planeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc })
    const planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.rotation.x = THREE.MathUtils.degToRad(-90)
    scene.add(planeMesh)

    const colorPicker = new ColorPicker()
    cameraController = new CameraController(
      camera,
      cameraControllerGroup,
      threeViewport,
      bounds
    )
    sceneController = new SceneController(
      scene,
      planeMesh,
      camera,
      cameraControllerGroup,
      threeViewport,
      colorPicker,
      { up: upButton, right: rightButton, down: downButton, left: leftButton } // create a deconstructed object called controllerButtons in the sceneController
    )

    colorPicker.createColorPalette()

    resetButton.onclick = () => {
      cameraController.reset()
      sceneController.reset()
    }
  }

  const render = () => renderer.render(scene, camera)

  const update = () => {
    cameraController.rotateCamera()
  }

  const renderLoop = () => {
    update()
    render()
    requestAnimationFrame(renderLoop)
  }

  initializeScene()
  renderLoop()
}
