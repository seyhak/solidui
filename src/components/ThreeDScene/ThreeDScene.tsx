import { createEffect, onMount } from "solid-js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import * as THREE from "three"
import { ThreeDData } from "src/pages/ThreeD/ThreeD"

type DataComponent = ThreeDData["components"][number]
type DataComponentInstance =
  ThreeDData["components"][number]["instances"][number]

const R_COMP = 15
const R_INST = 3
const CAMERA_DIST = 70
const GLOBALS = {
  HUD: {
    SCENE: null
  },
  CAMERA: {
    CAMERA: null,
    EDGES: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }}
}
let MAX_SPEED_COMPONENT = 2 // 3 is a lot
let MAX_SPEED_INSTANCE =  2 // 3 is a lot

const RENDERER_ID = "3d-renderer"

const degreesToRads = (deg) => (deg * Math.PI) / 180.0

const rotateAroundCenter = (element, r = 15, center = { x: 0, y: 0 }) => {
  const distanceMultiplied = r
  const signMultX = center.x > 0 ? 1 : -1
  const signMultY = center.y > 0 ? 1 : -1
  const startPosition = r
  const isXStarting = !Math.sin(element.t)
  const isYStarting = !Math.cos(element.t)
  const OffsetX = isXStarting ? startPosition : center.x
  const OffsetY = isYStarting ? startPosition : center.y
  const nextX = Math.sin(element.t) * distanceMultiplied
  element.position.x = nextX + OffsetX
  const nextY = Math.cos(element.t) * distanceMultiplied
  element.position.y = nextY + OffsetY
}

const createSphere = () => {
  const geometry = new THREE.SphereGeometry(1)
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // const material = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
  const material = new THREE.MeshLambertMaterial({ color: 0x0000ff })
  // const material = new THREE.MeshToonMaterial( { color: 0x00ff00 } );
  // const material = new THREE.MeshLambertMaterial();
  const sphere = new THREE.Mesh(geometry, material)
  material.color = new THREE.Color(0x0000ff)
  return sphere
}

const generateComponentText = (texts = ["Hi"]) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const size = 256 // Canvas size
  canvas.width = size
  canvas.height = size
  // Background (optional)
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)" // Transparent background
  ctx.fillRect(0, 0, size, size)

  // Text settings
  ctx.font = "30px Arial"
  ctx.fillStyle = "white"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  let lineHeight = 30
  for (let index = 0; index < texts.length; index++) {
    const element = texts[index];
    ctx.fillText(element, 0, lineHeight * index, size / 2)
  }
  const texture = new THREE.CanvasTexture(canvas)

  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)
  const scale = 4
  sprite.scale.set(scale, scale, 1) // Adjust sprite size
  // sprite.position.set(2, 0, 1); // Adjust sprite size
  return sprite
}

const makeAnimable = (src, idx: number) => {
  src.animate = (el) => {
    if (el.stopped) return
    el.rotation.x += 0.01
    el.rotation.y += 0.01
    for (let index = 0; index < el.speed; index++) {
      rotateAroundCenter(el, (el.index + 1) * R_COMP)
      el.progressT(el)
    }
    el.instances.forEach((i) => {
      i.animate(i)
    })
  }
  src.onHover = (obj, scene) => {
    obj.material.color.set(0xffffff)
    obj.stopped = true
    obj?.instances?.forEach((i) => {
      i.stopped = true
    })
    obj.objects.forEach((o) => {
      const mult = obj.position.x < 0 ? -1 : 1
      o.position.set(-1.25, -0.75, 0)
      o.scale.set(1, 0.5, 0.5); // Adjust size
      // o.position.set(0, 0, GLOBALS.CAMERA.CAMERA.position.z - 20)
      GLOBALS.HUD.SCENE.add(o)
      // scene.add(o)
    })
  }
  src.onOutHover = (obj, scene) => {
    obj.material.color.set(obj.originalColor)
    obj.stopped = false
    obj.objects.forEach((o) => {
      GLOBALS.HUD.SCENE.remove(o)
    })
  }
  src.index = idx
  src.progressT = (obj) => {
    const diff = Math.PI / 314
    if (obj.t > Math.PI * 2) {
      obj.t = 0
    }
    obj.t += diff
  }
  src.t = 0
  src.stopped = false
  src.originalColor = { ...src.material.color }
  src.speed = ((Math.random() * 100) % MAX_SPEED_COMPONENT).toFixed(2)
  return src
}

const createInstance = (instance: DataComponentInstance, idx: number) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0xc7dcff })
  const cube = new THREE.Mesh(geometry, material)
  makeAnimable(cube, idx)

  cube.speed = ((Math.random() * 100) % MAX_SPEED_INSTANCE).toFixed(2)
  cube.animate = (el) => {
    if (el.stopped) return
    el.rotation.x += 0.01
    el.rotation.y += 0.01
    const distanceFromCenter = 1
    for (let index = 0; index < el.speed; index++) {
      const parentPos = el.creator
        ? { x: el.creator.position.x, y: el.creator.position.y }
        : { x: 0, y: 0 }

      rotateAroundCenter(el, (el.index + 1) * R_INST, parentPos)
      el.progressT(el)
    }
  }
  cube.objects = []

  return cube
}

const createComponent = (component: DataComponent, idx: number) => {
  const sphere = createSphere()
  makeAnimable(sphere, idx)

  const light = new THREE.PointLight(0xffffbb, 2, 1)
  const sphere1 = createSphere()
  sphere.instances =
    component?.instances?.map((i, iidx) => {
      const instance = createInstance(i, iidx)
      instance.creator = sphere
      return instance
    }) || []
  const instancesTxts = component?.instances?.map(si => {
    return (`Instance: ${si.name}`)
  }) || []
  const sprite = generateComponentText([
    `Component: ${component.name}`,
    ...instancesTxts
  ])
  // scene.add( sprite );
  sphere.objects = [sprite]
  return {
    sphere,
  }
}

const generateElements = (data: ThreeDData) => {
  const components = []
  const apps = []
  data.components.forEach((c, idx) => {
    const { sphere } = createComponent(c, idx)
    sphere.position.x = -3 * (idx + 1)

    components.push(sphere)
    sphere.instances.forEach((i) => components.push(i))
  })
  // add sun
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 })
  const cube = new THREE.Mesh(geometry, material)
  const cube1 = new THREE.Mesh(geometry, material)
  cube1.rotation.z = degreesToRads(45)
  apps.push(cube)
  apps.push(cube1)
  return {
    components,
    apps,
  }
}
const handleMouse = () => {
  // Raycaster Setup
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hoveredObject = null

  function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1.1
  }
  window.addEventListener("mousemove", onMouseMove)
  return { raycaster, mouse }
}

const handleRaycasting = (raycaster, mouse, camera, scene, rayline) => {
  if (mouse.x === 0 && mouse.y === 0) {
    return
  }
  // Raycasting
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  // Update ray visualization
  const origin = raycaster.ray.origin
  const direction = raycaster.ray.direction.clone().multiplyScalar(5000)
  rayline.geometry.setFromPoints([
    { ...origin, y: origin.y - 1 },
    origin.clone().add(direction),
  ])

  for (let i = 0; i < scene.children.length; i++) {
    const el = scene.children[i]
    el.onOutHover?.(el, scene)
  }
  for (let i = 0; i < intersects.length; i++) {
    const el = intersects[i].object
    el.onHover?.(el, scene)
  }
}
const handleHUD = () => {
  const hudScene = new THREE.Scene();
  const hudCamera = new THREE.OrthographicCamera(-2, 2, 1, -1, 0.1, 10);
  hudCamera.position.z = 1;

  return {
    hudCamera, hudScene
  }
}

const handleScene = (data: ThreeDData) => {
  // basic setup
  const scene = new THREE.Scene()
  const texture = new THREE.TextureLoader().load("textures/galaxy.jpg")
  texture.colorSpace = THREE.SRGBColorSpace
  scene.background = texture

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = CAMERA_DIST

  const renderer = new THREE.WebGLRenderer()
  const el = document.getElementById(RENDERER_ID)
  renderer.setSize(el.offsetWidth, el.offsetHeight)
  el.appendChild(renderer.domElement)

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  const elements = generateElements(data)
  Object.values(elements).forEach((v) => {
    v.forEach((el) => {
      scene.add(el)
    })
  })

  // light
  const light = new THREE.AmbientLight(0xffffff) // White ambient light
  scene.add(light)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  directionalLight.position.set(5, 0, 10).normalize()
  scene.add(directionalLight)

  // raycasting
  const { mouse, raycaster } = handleMouse()
  const rayLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })
  const rayLineGeometry = new THREE.BufferGeometry()
  const rayLine = new THREE.Line(rayLineGeometry, rayLineMaterial)
  scene.add(rayLine)
  function getCameraEdges(camera) {
    const aspect = window.innerWidth / window.innerHeight
    const vFov = (camera.fov * Math.PI) / 180

    const height = 2 * Math.tan(vFov / 2) * camera.position.z
    const width = height * aspect

    return {
      left: -width / 2,
      right: width / 2,
      top: height / 2,
      bottom: -height / 2,
    }
  }
  // HUD
  const {hudScene, hudCamera} = handleHUD()

  GLOBALS.CAMERA.CAMERA = camera
  GLOBALS.HUD.SCENE = hudScene
  function animate() {
    GLOBALS.CAMERA.EDGES = {
      ...getCameraEdges(camera)
    }
    renderer.render(scene, camera)
    handleRaycasting(raycaster, mouse, camera, scene, rayLine)
    elements.components.forEach((el, idx) => {
      el.animate(el)
    })

    renderer.autoClear = false;

    // Render Main Scene
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth(); // Important to avoid depth issues
    renderer.render(hudScene, hudCamera);
  }
  renderer.setAnimationLoop(animate)
}

type ThreeDSceneProps = {
  data?: ThreeDData
  maxSpeed: number
}

const ThreeDScene = (props: ThreeDSceneProps) => {
  const data = () => props.data
  const maxSpeed = () => props.maxSpeed

  createEffect(() => {
    const el = document.getElementById(RENDERER_ID)
    MAX_SPEED_COMPONENT = maxSpeed()
    MAX_SPEED_INSTANCE = MAX_SPEED_COMPONENT + 2
    el.replaceChildren()
    handleScene(data())
  });
  return (
    <div id={RENDERER_ID} class="flex-1 flex flex-col w-full min-h-[1200px]">
      scene
    </div>
  )
}

export default ThreeDScene
