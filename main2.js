import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import {GUI} from './node_modules/dat.gui/build/dat.gui.module.js';



//Dimensiones
var d = 1;
var dext = 120;
var r = (dext-d)/2;
var n = 1;
var lo = 300;
var l1 = 0;
var l2 = 0;

var nodos = 13;
var delta = n*360/nodos

var x=[], y=[], z=[], t=[];
for(var i=0; i<=nodos; i++){
    y.push(i/nodos*lo);
    t.push(i*delta);
    x.push(r*Math.cos(t[i]*Math.PI/180));
    z.push(r*Math.sin(t[i]*Math.PI/180));
}


//Creación de escena
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x200000);
//Creación de camara
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
camera.position.set(5,5,5);
camera.lookAt(0,0,0);


//Renderizado
var renderer = new THREE.WebGLRenderer({antialias:true});
//renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight); 
//si lo de arriba no se pone, entonces la pantalla se ve pequeña.
document.body.appendChild(renderer.domElement);

//Control
var controls = new OrbitControls(camera, renderer.domElement); //escucha lo q dice el mouse

//Resize
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //cada vez que se ajuste la camara se debe llamar.
});

//Lineas
var material = new THREE.MeshNormalMaterial();
var geometry = new THREE.BoxGeometry(1,1,5);
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var ang=0.01;
cube.rotateOnAxis(new THREE.Vector3(0,1,0), ang);
cube.rotateOnAxis(new THREE.Vector3(1,0,0), ang);
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cube.rotateOnAxis(new THREE.Vector3(0,1,0), ang);
    cube.rotateOnAxis(new THREE.Vector3(1,0,0), ang);
    //cube.rotateOnAxis(new THREE.Vector3(0,1,0), ang);


};

animate();