import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

camera.position.z = 3;

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);


const house = new THREE.Group();

// Muret e shtepise
const wallGeometry = new THREE.BoxGeometry(1.5, 1.2, 1.2);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xd9a066 });
const walls = new THREE.Mesh(wallGeometry, wallMaterial);
house.add(walls);

// Cati ne forme koni
const roofGeometry = new THREE.ConeGeometry(1.1, 0.9, 4);
const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xb83227 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 1.0;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Oxhaku ne forme cilindri
const chimneyGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
const chimneyMaterial = new THREE.MeshBasicMaterial({ color: 0x777777 });
const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
chimney.position.set(0.45, 1.05, -0.25);
house.add(chimney);

// Dera
const doorGeometry = new THREE.BoxGeometry(0.3, 0.55, 0.05);
const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x603813 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, -0.32, 0.63);
house.add(door);

// Dritarja e majte
const windowGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.05);
const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb });

const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
leftWindow.position.set(-0.48, 0.1, 0.63);
house.add(leftWindow);

// Dritarja e djathte
const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
rightWindow.position.set(0.48, 0.1, 0.63);
house.add(rightWindow);

// Vendosim shtepine ne te djathte te kubit
house.position.x = 2.2;
scene.add(house);


const light = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);


function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;
    renderer.render(scene, camera);
}
animate();