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

//Creación de camara
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
camera.position.set(0,0,100);
camera.lookAt(0,0,0);


//Renderizado
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight); 
//si lo de arriba no se pone, entonces la pantalla se ve pequeña.
document.body.appendChild(renderer.domElement);

//Resize
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //cada vez que se ajuste la camara se debe llamar.
});

//Lineas
var material = new THREE.LineBasicMaterial({color: 0x0000ff});

var points = [];
var points2 = [];
for(i=0; i<=nodos; i++){
    points.push(new THREE.Vector3(x[i], y[i], z[i]));
    points2.push(new THREE.Vector3(x[i], y[i], z[i]));
}
var pr = 2;
//Longitudes
var long =[];
var xprom = [];
var zprom = [];
var yprom = [];
var angle = [];
//var parent = new THREE.Object3D();

var axy = new THREE.Vector3(0,1,0);
var axx = new THREE.Vector3(1,0,0);
var axz = new THREE.Vector3(0,0,1);

var ang = 1.57;
var q = new THREE.Quaternion();
var punto = new THREE.Vector3(0,0,59.5);
q.setFromAxisAngle(axz, ang);





var points3=[];
points3.push(new THREE.Vector3(x[0],y[0],z[0]));
points3.push(new THREE.Vector3(x[1],y[1],z[1]));
var geom = new THREE.BufferGeometry().setFromPoints(points3);
var line2 = new THREE.Line(geom, material);

line2.applyQuaternion(q);
line2.position.sub(punto);
line2.position.applyQuaternion(q);
line2.position.add(punto);


var points4=[];
points4.push(new THREE.Vector3(x[0],y[0],z[0]));
points4.push(new THREE.Vector3(x[0],y[1],z[0]));

var geom2 = new THREE.BufferGeometry().setFromPoints(points4);
var line3 = new THREE.Line(geom2, material);
scene.add(line2);
//parent.add(line2);
scene.add(line3);


console.log(line2.matrixWorld);

console.log(line2.matrix);

//line3.rotateOnWorldAxis(axz,ang/180*Math.PI);

for(i=0; i<pr; i++){
    long.push(points[i].distanceTo(points[i+1]));
    xprom.push((points[i].x+points[i+1].x)/2);
    zprom.push((points[i].z+points[i+1].z)/2);
    yprom.push((points[i].y+points[i+1].y)/2);
    
    angle.push({x:Math.acos((points2[i+1].x-points2[i].x)/long[i])*180/Math.PI,
                y:Math.acos((points2[i+1].y-points2[i].y)/long[i])*180/Math.PI,
                z:Math.acos((points2[i+1].z-points2[i].z)/long[i])*180/Math.PI});  
}



console.log({points2});
console.log({angle});
console.log({long});





const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);
line.position.set(0,0,0);
//scene.add(line);
var s;

//Creación de cilindros
for(i=0;i<1;i++){
    var geometry2 = new THREE.BoxGeometry(d,long[i],d);
    //var geometry2 = new THREE.CylinderGeometry(d,d,long[i],32);
    var material2 = new THREE.MeshNormalMaterial();
    var cylinder = new THREE.Mesh(geometry2, material2);
    //cylinder.position.set(xprom[i],yprom[i],zprom[i]);
    //cylinder.position.set(0,0,0);
    //cylinder.rotation.set(angle[i].x/180*Math.PI,angle[i].y/180*Math.PI,-angle[i].z/180*Math.PI);
    //cylinder.rotation.set(0,150/180*Math.PI,90/180*Math.PI);

    //cylinder.applyQuaternion(quaternion);
    scene.add(cylinder);
}
//cylinder.rotateOnWorldAxis(axy, 0.88979);
cylinder.rotateOnWorldAxis(axx, 1.7578);



//var cylinder2 = new THREE.Mesh(geometry2, material2);
//cylinder2.position.set(xprom[1],yprom[1],zprom[1]);
//cylinder.position.set(0,0,0);
//cylinder.rotation.set(angle[i].x/180*Math.PI,angle[i].y/180*Math.PI,-angle[i].z/180*Math.PI);
//cylinder2.rotation.set(0,0,0);


//scene.add(cylinder2);

//Control
var controls = new OrbitControls(camera, renderer.domElement); //escucha lo q dice el mouse

//Controls
const gui = new GUI();
/*
gui.add(cylinder.rotation, 'x').min(0).max(Math.PI).step(0.01).name('Rotate X Axis');
gui.add(cylinder.rotation, 'y').min(0).max(Math.PI).step(0.01).name('Rotate Y Axis');
gui.add(cylinder.rotation, 'z').min(0).max(Math.PI).step(0.01).name('Rotate Z Axis');
gui.add(cylinder2.rotation, 'x').min(0).max(Math.PI).step(0.01).name('Rotate X Axis');
gui.add(cylinder2.rotation, 'y').min(0).max(Math.PI).step(0.01).name('Rotate Y Axis');
gui.add(cylinder2.rotation, 'z').min(0).max(Math.PI).step(0.01).name('Rotate Z Axis');
*/
//Animate

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //cylinder.rotation.y +=0.1
    //cylinder.rotateOnWorldAxis(axz, ang);
    line3.rotateOnWorldAxis(axz, ang*Math.PI);

};

animate();