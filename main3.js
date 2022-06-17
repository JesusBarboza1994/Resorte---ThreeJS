import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import {GUI} from './node_modules/dat.gui/build/dat.gui.module.js';



//Dimensiones
var d = 1;
var dext = 120;
var r = (dext-d)/2;
var n =10;
var lo = 200;
var l1 = 0;
var l2 = 0;

var nodos = 200;
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
scene.background = new THREE.Color(0xFFFFFF);
//Creación de camara
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
camera.position.set(0,80,0);
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

var pr = 2;
var points = [];
var points2 = [];
for(i=0; i<=nodos; i++){
    points.push(new THREE.Vector3(x[i], y[i], z[i]));
    points2.push(new THREE.Vector3(x[i], y[i], z[i]));
}

//Longitudes
var long =[];
var xprom = [];
var zprom = [];
var yprom = [];
var angle = [];

for(i=0; i<pr; i++){
    long.push(points[i].distanceTo(points[i+1]));
    xprom.push((points[i].x+points[i+1].x)/2);
    zprom.push((points[i].z+points[i+1].z)/2);
    yprom.push((points[i].y+points[i+1].y)/2);
    
    angle.push({x:Math.acos((points2[i+1].x-points2[i].x)/long[i])*180/Math.PI,
                y:Math.acos((points2[i+1].y-points2[i].y)/long[i])*180/Math.PI,
                z:Math.acos((points2[i+1].z-points2[i].z)/long[i])*180/Math.PI});  
}

// parent
parent = new THREE.Object3D();
scene.add( parent );

const geom = new THREE.BufferGeometry().setFromPoints(points);
var mat = new THREE.LineBasicMaterial({color: 0x0000ff});
const line = new THREE.Line(geom, mat);
line.position.set(0,0,0);
scene.add(line);

var sfera = new THREE.Spherical().
setFromCartesianCoords(points[1].x - points[0].x,
                       points[1].y - points[0].y,
                       points[1].z -points[0].z);

console.log(sfera);

// pivots
var pivot1 = new THREE.Object3D();
var pivot2 = new THREE.Object3D();
//var pivot3 = new THREE.Object3D();

pivot1.position.set(xprom[0],yprom[0],zprom[0]);
//pivot3.rotation.y = angle[0].y / 180 * Math.PI;
pivot1.rotation.x = sfera.phi;
pivot2.rotation.z = -sfera.theta;
parent.add( pivot1 );
pivot1.add( pivot2 );
//pivot2.add( pivot3 );

// mesh
var geometry = new THREE.BoxGeometry(1,sfera.radius,1);
var material = new THREE.MeshNormalMaterial({color: 'blue'});
var mesh1 = new THREE.Mesh( geometry, material );
console.log(points)
/* 
mesh1.position.y = 5;
mesh2.position.y = 5;
mesh3.position.y = 5;
 */

pivot2.add( mesh1 );

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //parent.rotation.z += 0.01;

};

animate();