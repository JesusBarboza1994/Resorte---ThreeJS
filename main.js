import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";


//Dimensiones
var d = 1;
var dext = 120;
var r = (dext-d)/2;
var n = 1;
var lo = 300;
var l1 = 0;
var l2 = 0;

var nodos = 100/8;
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
camera.position.set(0,0,300);
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
const material = new THREE.LineBasicMaterial({color: 0x0000ff});

const points = [];
const points2 = [];
for(i=0; i<=nodos; i++){
    points.push(new THREE.Vector3(x[i], y[i], z[i]));
    points2.push(new THREE.Vector3(x[i], y[i], z[i]));
}
var pr = 1;
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



console.log({points2});
console.log({angle});



const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);
line.position.set(0,0,0);
scene.add(line);
var s;

//Creación de cilindros
for(i=0;i<pr;i++){
    var geometry2 = new THREE.CylinderGeometry(d,d,long[i],32);
    var material2 = new THREE.MeshNormalMaterial();
    var cylinder = new THREE.Mesh(geometry2, material2);
    cylinder.position.set(xprom[i],yprom[i],zprom[i]);
    //cylinder.position.set(0,0,0);
    //cylinder.rotation.set(angle[i].x/180*Math.PI,angle[i].y/180*Math.PI,-angle[i].z/180*Math.PI);
    cylinder.rotation.set(-101/180*Math.PI,0/180*Math.PI,41/180*Math.PI);

   
    scene.add(cylinder);
}

//Control
var controls = new OrbitControls(camera, renderer.domElement); //escucha lo q dice el mouse

//Animate
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();