import {GLTFLoader} from './GLTFLoader.js'
import * as THREE from './three.module.js'
import {OrbitControls} from './OrbitControls.js'
import data from './data1.json' assert {type:'json'}

let pointer = new THREE.Vector2
let touch = new THREE.Vector2
let raycaster = new THREE.Raycaster()


var scene = new THREE.Scene();
let textureLoader = new THREE.TextureLoader();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1 ,1000);

var renderer = new THREE.WebGL1Renderer({ antialias: true, physicallyCorrectLights: true, outputEncoding: THREE.sRGBEncoding, gammaOutput: true, gammaFactor: 2.2});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false;
controls.maxDistance = 100;
controls.minDistance = 8.2;


var loader = new GLTFLoader();
var obj;
  
loader.load('nasa.glb', function(gltf){
    obj = gltf.scene;
    scene.add(gltf.scene);
});

scene.background = new THREE.Color(0x000000);
//var light = new THREE.HemisphereLight(0xffffff,0x000000, 3);
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100, 10,50);
camera.position.set(0,0,10);
scene.add(light);

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6);
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
///Nishanth
for(var ob of data){

  const circleGeometry =  new THREE.SphereGeometry(3/50,30,30)
  const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true,
          opacity: 0.5})
  
  const circle = new THREE.Mesh(circleGeometry, circleMaterial)
  circle.userData = ob
          
  let cr = ob.coordinates
  //console.log(cr)
  circle.position.set(cr[0], cr[1], cr[2])
  //console.log(circle)
  scene.add(circle)
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onTouch(event){
touch.x = +(event.changedTouches[0].clientX / window.innerWidth) * 2 -1;

touch.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

console.log(touch)

raycaster.setFromCamera( touch, camera );
        

const intersects = raycaster.intersectObjects( scene.children );
console.log(intersects[0].object)
if(intersects.length>0){
    let selectedPiece = intersects[0].object.userData
    
	if(data.indexOf(selectedPiece)!=-1){
    console.log(selectedPiece)
    console.log(data.indexOf(selectedPiece))

    let mag = document.getElementById("mag")
    let dep = document.getElementById("dep")
    mag.innerText = selectedPiece.dep_err.toString()
    console.log(mag.innerText)
    dep.innerText = selectedPiece.dep
	}
}
}

function onWindowResize() {
         
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
         
  renderer.setSize( window.innerWidth, window.innerHeight );
         
  }

//console.log(data[220])
        
addEventListener( 'pointerdown', onDocumentMouseDown, false );
function onDocumentMouseDown( event ) 
  {
      raycaster.setFromCamera( pointer, camera );

      const intersects = raycaster.intersectObjects( scene.children );
      if(intersects.length>0){
          let selectedPiece = intersects[0].object.userData
          
    if(data.indexOf(selectedPiece)!=-1){
      console.log(selectedPiece)
          console.log(data.indexOf(selectedPiece))
          let mag = document.getElementById("mag")
          let dep = document.getElementById("dep")
          mag.innerText = selectedPiece.dep_err
          dep.innerText = selectedPiece.dep
    }
  
      }
}
//window.addEventListener('click', onClick);  
window.addEventListener('pointermove', onPointerMove)      
//window.addEventListener('click', onClick);
window.addEventListener('touchend', onTouch)
window.addEventListener('resize', onWindowResize);

//Nishanth
function animate(){

    window.requestAnimationFrame(animate);
    //obj.rotation.y += 0.001;
    //console.log(obj.scale)
   
    background.rotation.y += 0.001;
    //obj.roughness = 0.5

    renderer.render(scene,camera);
}
animate();