import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

// Fonts:
const myText = "drespns"
const fontLoader = new FontLoader()
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    console.log('Font loaded!')
    const textGeometry = new TextGeometry(myText,
        {
            font: font,
            size: .5,
            depth: .2,
            curveSegments: 4, //
            bevelEnabled: true,
            bevelThickness: .03,
            bevelSize: .02,
            bevelOffset: 0,
            bevelSegments: 4 //
        }
    )
    // Bounding:
    textGeometry.computeBoundingBox()
    console.log(textGeometry.boundingBox)
    textGeometry.center() // <<Center the geometry based on the bounding box.>>

    const textMaterial = new THREE.MeshMatcapMaterial()
    textMaterial.wireframe = false
    textMaterial.matcap = matcapTextTexture

    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
}) // slightly different from 'texture' loadings:
// const texture = textureLoader.load() and we get the texture right away.

// ------

// Debug UI
const gui = new GUI()

const canvas = document.querySelector('canvas.webgl') // Canvas

const scene = new THREE.Scene() // Scene
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTextTexture = textureLoader.load('/textures/matcaps/nidorx.jpg')
matcapTextTexture.colorSpace = THREE.SRGBColorSpace
const matcapDonutTexture = textureLoader.load('/textures/matcaps/8.png')
matcapDonutTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Objects
 */

// OPTIMIZATION
const donutGeometry = new THREE.TorusGeometry(.3, .25, 32, 64)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonutTexture })
console.time('donuts')
for (let i = 1; i < 100; i++){
    const donut = new THREE.Mesh(
        donutGeometry,
        donutMaterial
    ) // 1.3 ms
    const x = (Math.random() - .5) * i
    const y = (Math.random() - .5) * i
    const z = (Math.random() - .5) * i
    donut.position.set(x, y, z)

    const xRotation = Math.random() * Math.PI
    const yRotation = Math.random() * Math.PI
    donut.rotation.x = xRotation
    donut.rotation.y = yRotation
    scene.add(donut)
}; console.timeEnd('donuts') // 

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const frame = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update() // updating controls
    renderer.render(scene, camera) // rendering
    window.requestAnimationFrame(frame) // calling 'frame' again on the next frame.
}
frame()