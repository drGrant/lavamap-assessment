import * as THREE from 'three'
import { Vector3 } from 'three'

class SceneController {
  constructor (
    scene,
    groundPlane,
    camera,
    controller,
    threeViewport,
    colorPickerRef,
    controllerButtons
  ) {
    this.scene = scene
    this.sceneObjects = []
    this.groundPlane = groundPlane
    this.camera = camera
    this.controller = controller
    this.viewport = threeViewport
    this.colorPickerRef = colorPickerRef
    this.controllerButtons = controllerButtons
    this.space = 40
    this.mousePosition = new THREE.Vector2(0, 0)

    this.viewport.addEventListener('mousedown', this.mouseCapture.bind(this))
    this.viewport.addEventListener(
      'mousemove',
      this.setMousePosition.bind(this)
    )
    // add event listeners for move controller
    Object.keys(this.controllerButtons).forEach(key =>
      this.controllerButtons[key].addEventListener('click', () =>
        this.move(key)
      )
    )
  }

  setMousePosition (event) {
    const bounds = this.viewport.getBoundingClientRect()
    const positionX =
      ((event.clientX - bounds.left) * this.viewport.clientWidth) / bounds.width
    const positionY =
      ((event.clientY - bounds.top) * this.viewport.clientHeight) /
      bounds.height

    this.mousePosition.x = (positionX / this.viewport.clientWidth) * 2 - 1
    this.mousePosition.y = (positionY / this.viewport.clientHeight) * -2 + 1
  }

  createObject (color, positionX, positionZ) {
    const hex = `0x${color}`
    const box = new THREE.BoxGeometry(25, 25, 25)
    const material = new THREE.MeshBasicMaterial({ color: parseInt(hex, 16) })
    const mesh = new THREE.Mesh(box, material)
    mesh.position.set(positionX, 10, positionZ)
    this.scene.add(mesh)
    this.sceneObjects.push({ box, material, mesh })
  }

  mouseCapture (event) {
    if (event.button === 0) {
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(this.mousePosition, this.camera)
      const intersect = raycaster.intersectObject(this.groundPlane)
      if (intersect.length) {
        this.createObject(
          this.colorPickerRef.selectedColor,
          intersect[0].point.x,
          intersect[0].point.z
        )
      }
    }
  }

  correctRotation (vector3) {
    return vector3.applyEuler(this.controller.rotation)
  }
  move (condition) {
    //Implement move here
    //object must be moved like in the sample recording

    const currentMesh = this.sceneObjects[this.sceneObjects.length - 1]
    if (!(!!currentMesh ?? true)) return
    const nextPosition = currentMesh.mesh.position.clone()
    switch (condition) {
      case 'up':
        nextPosition.add(this.correctRotation(new Vector3(0, 0, -this.space)))
        break
      case 'right':
        nextPosition.add(this.correctRotation(new Vector3(this.space, 0, 0)))
        break
      case 'down':
        nextPosition.add(this.correctRotation(new Vector3(0, 0, this.space)))
        break
      case 'left':
        nextPosition.add(this.correctRotation(new Vector3(-this.space, 0, 0)))
        break
      default:
        return
    }
    currentMesh.mesh.position.copy(nextPosition)
  }

  reset () {
    this.sceneObjects.forEach(({ box, material, mesh }) => {
      this.scene.remove(mesh)
      box.dispose()
      material.dispose()
    })
    this.sceneObjects = []
  }
}

export { SceneController }
