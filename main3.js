import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import {GUI} from './node_modules/dat.gui/build/dat.gui.module.js';

//Dimensiones de Resorte (inputs)
var d = 12;
var dext = 120;
var r = (dext-d)/2;
var n =6;
var lo = 300;
var l1 = 0;
var l2 = 0;

//Inputs de modelamiento
var defT = 20;
var nodos = 1000;
var delta = n*360/nodos

//posición de los elementos
var x=[], y=[], z=[], t=[];
for(var i=0; i<=nodos; i++){
    y.push(i/nodos*lo);
    t.push(i*delta);
    x.push(r*Math.cos(t[i]*Math.PI/180));
    z.push(r*Math.sin(t[i]*Math.PI/180));
}

// Canvas
const canvas = document.querySelector('canvas.webgl');

//Escena
var scene = new THREE.Scene();
/* scene.background = new THREE.Color(0x000000); */

//Camara
var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
camera.position.set(300,0,0);
camera.lookAt(0,0,0);

//Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('./textures/NormalMap2.png')

//Renderizado
var renderer = new THREE.WebGLRenderer({antialias:true,
    canvas: canvas,
    alpha: true
});
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

//Creación de puntos en el espacio
var points = [];
for(i=0; i<=nodos; i++){
    points.push(new THREE.Vector3(x[i], y[i], z[i]));
}

//Longitudes
var long =[];
var xprom = [];
var zprom = [];
var yprom = [];
for(i=0; i<nodos; i++){
    long.push(points[i].distanceTo(points[i+1]));
    xprom.push((points[i].x+points[i+1].x)/2);
    zprom.push((points[i].z+points[i+1].z)/2);
    yprom.push((points[i].y+points[i+1].y)/2);
}

//Línea media del resorte
const geom = new THREE.BufferGeometry().setFromPoints(points);
var mat = new THREE.LineBasicMaterial({color: 0x0000ff});
const line = new THREE.Line(geom, mat);
scene.add(line);

//Material del resorte
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929)

//Parent y pivots
var parent = new THREE.Object3D();
scene.add( parent );
var pivot1 = [];
var pivot2 = [];
var mesh=[];


var sfera = new THREE.Spherical();
for(i=0; i<nodos; i++){
    sfera.
    setFromCartesianCoords(points[i+1].x - points[i].x,
                           points[i+1].y - points[i].y,
                           points[i+1].z - points[i].z);
    
    pivot1.push(new THREE.Object3D());
    pivot2.push(new THREE.Object3D());

    pivot1[i].position.set(xprom[i],yprom[i],zprom[i]);
    pivot1[i].rotation.x = sfera.phi; 
    pivot2[i].rotation.z = -sfera.theta;

    parent.add( pivot1[i] );
    pivot1[i].add( pivot2[i] );

    //Mesh
    var geometry = new THREE.CylinderGeometry(d/2,d/2,sfera.radius,32);
    //var material = new THREE.MeshNormalMaterial();
    
    //Bordes de cada elemento
    /* if(i%2 ==0){
        var edges = new THREE.EdgesGeometry( geometry );
        var line2 = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    pivot2[i].add( line2 );
    }
 */
    mesh[i] = new THREE.Mesh( geometry, material );
    pivot2[i].add( mesh[i] );
}

// Lights
const pointLight = new THREE.PointLight(0xbb1818, 0.1)
pointLight.position.x = -80;
pointLight.position.y = lo;
pointLight.position.z = -80;
pointLight.intensity = 50;
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xbb1818, 0.1)
pointLight2.position.x = 80;
pointLight2.position.y = lo;
pointLight2.position.z = 80;
pointLight2.intensity = 50;
scene.add(pointLight2)

const light1 = new GUI();
light1.add(pointLight.position, 'y').min(0).max(400).step(0.01)
light1.add(pointLight.position, 'x').min(-80).max(80).step(0.01)
light1.add(pointLight.position, 'z').min(-80).max(80).step(0.01)
light1.add(pointLight, 'intensity').min(0).max(100).step(0.01)

const lightColor = {
    color: 0xff0000
}

light1.addColor(lightColor, 'color')
    .onChange(() =>{
        pointLight.color.set(lightColor.color)
    }) 


//Animación
var v = 100; //velocidad de compresión de resorte

const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    for(i=0;i<pivot1.length;i++){
        pivot1[i].position.y -= i*defT/nodos/v*Math.sin(elapsedTime); 
    }

};

animate();

//Controls
/* const gui = new GUI();
gui.add(camera.rotation, 'y').min(0).max(2*Math.PI).step(0.01).name('Rotate Y Axis');
gui.add(camera.rotation, 'x').min(0).max(2*Math.PI).step(0.01).name('Rotate X Axis');
gui.add(camera.rotation, 'z').min(0).max(2*Math.PI).step(0.01).name('Rotate Z Axis');
gui.add(camera.position, 'y').min(0).max(100).step(0.01).name('Position Y Axis');
gui.add(camera.position, 'x').min(0).max(100).step(0.01).name('Position X Axis');
gui.add(camera.position, 'z').min(0).max(100).step(0.01).name('Position Z Axis');
 */