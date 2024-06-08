import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
// --------------------------------------------------------------------------

// Event Handlers:
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

// window.addEventListener('keydown', function(event){
//     if (event.key == 'h'){
//         gui.show( gui._hidden ) // toggling
//     }
// })

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

// Debug UI: const gui = new GUI()
// const gui = new dat.GUI({
//     width: 250,
//     title: 'Debug UI',
//     closeFolders: false,
// })
// const debugObject = {}
// debugObject.color = 'indigo'
// debugObject.wireframe = false
// debugObject.axesHelperVisibility = true
// debugObject.spin = () => {
//     gsap.to(torus.rotation, {y: torus.rotation.y + 2*Math.PI, duration: 2, delay: 0});
//     gsap.to(torus.rotation, {y: torus.rotation.y - 2*Math.PI, delay: 2, duration: 1});
// }

const canvas = document.querySelector('canvas.webgl') // Canvas

const scene = new THREE.Scene() // Scene
scene.background = new THREE.Color({ color: 'slategray' })
// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)

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

// 
const donutGeometry = new THREE.TorusGeometry(.3, .25, 32, 64)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonutTexture })
donutMaterial.side = THREE.DoubleSide
console.time('donuts')
let donuts = [];
for (let i = 5; i < 150; i++){
    const donut = new THREE.Mesh(
        donutGeometry,
        donutMaterial
    ) // 1.3 ms
    const x = (Math.random() - .5) * i
    const y = (Math.random() - .5) * i
    const z = (Math.random() - .5) * i
    donut.position.set(x, y, z)

    // const xRotation = Math.random() * Math.PI
    // const yRotation = Math.random() * Math.PI
    // donut.rotation.x = xRotation
    // donut.rotation.y = yRotation
    const xRotation = - Math.random() * 0.1; // Define rotation speed on x-axis
    const yRotation = Math.random() * 0.25; // Define rotation speed on y-axis
    donut.userData.rotationSpeed = { x: xRotation, y: yRotation };
    // userData <- <<An object that can be used to store custom data about the Object3D.>>
    scene.add(donut)
    donuts.push(donut)
}; console.timeEnd('donuts') // 


const sizes = { // sizes
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 4)
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

    // donut.rotation.x = -.15 * (elapsedTime * 2*Math.PI)
    // donut.rotation.y = .25 * (elapsedTime * 2*Math.PI)
    // Animating each donut:
    donuts.forEach((donut) => {
        // const xRotation = (Math.random() - 1) * .25
        // const yRotation = (Math.random()) * .25
        donut.rotation.x = -.15 * (elapsedTime * 2 * Math.PI);
        donut.rotation.y = .25 * (elapsedTime * 2 * Math.PI);
    });
    // donuts.forEach(donut => {
    //     const { x: xSpeed, y: ySpeed } = donut.userData.rotationSpeed;
    //     donut.rotation.x += xSpeed * elapsedTime;
    //     donut.rotation.y += ySpeed * elapsedTime;
    // });

    controls.update() // updating controls
    renderer.render(scene, camera) // rendering
    window.requestAnimationFrame(frame) // calling 'frame' again on the next frame.
}
frame()