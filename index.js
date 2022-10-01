import {GLTFLoader} from './GLTFLoader.js'
import * as THREE from './three.module.js'
import {OrbitControls} from './OrbitControls.js'


var scene = new THREE.Scene();
let textureLoader = new THREE.TextureLoader();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1 ,1000);

var renderer = new THREE.WebGL1Renderer({ antialias: true, physicallyCorrectLights: true, outputEncoding: THREE.sRGBEncoding, gammaOutput: true, gammaFactor: 2.2});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false
controls.maxDistance = 100
controls.minDistance = 8.2


var loader = new GLTFLoader();
var obj;
  
loader.load('nasa.glb', function(gltf){
    obj = gltf.scene;
    scene.add(gltf.scene);
});
scene.background = new THREE.Color(0x000000);
//var light = new THREE.HemisphereLight(0xffffff,0x000000, 3);
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100,10,50);
camera.position.set(0,0,10);
scene.add(light);

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3);
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 0, 0 );
scene.add( hemiLight );


let backgroundGeo = new THREE.SphereGeometry(100, 32, 32);
let backgroundM = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let background = new THREE.Mesh(backgroundGeo, backgroundM);


textureLoader.crossOrigin = true;
textureLoader.load(
  'starfield.png',
  function(texture) {
    backgroundM.map = texture;
    scene.add(background);
  }
);

function onWindowResize() {
         
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
         
  renderer.setSize( window.innerWidth, window.innerHeight );
         
  }

window.addEventListener('resize', onWindowResize);

function animate(){

    window.requestAnimationFrame(animate);
    obj.rotation.y += 0.001;
   
    background.rotation.y += 0.001;
    //obj.roughness = 0.5
    renderer.render(scene,camera);
}
animate();