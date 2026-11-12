
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8e3dc);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(6, 5, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.enableDamping = true;
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xfff1df, 0.8);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xfff4e8, 2);
sunlight.position.set(5, 10, 6);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -10;
sunlight.shadow.camera.right = 10;
sunlight.shadow.camera.top = 10;
sunlight.shadow.camera.bottom = -10;
scene.add(sunlight);


// Floor - Walnut wood texture
const textureLoader = new THREE.TextureLoader();
const walnutTexture = textureLoader.load('./assets/whitefloor.jpg');

walnutTexture.wrapS = THREE.RepeatWrapping;
walnutTexture.wrapT = THREE.RepeatWrapping;
walnutTexture.repeat.set(4, 3);
walnutTexture.colorSpace = THREE.SRGBColorSpace;

const floorGeometry = new THREE.PlaneGeometry(16, 12);

const floorMaterial = new THREE.MeshStandardMaterial({
    map: walnutTexture,
    roughness: 0.8
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);



// Room walls
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1ede6,
    roughness: 0.9,
    side: THREE.DoubleSide
});

// Back wall
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(16, 5, 0.2),
    wallMaterial
);
backWall.position.set(0, 2.5, -6);
backWall.receiveShadow = true;
scene.add(backWall);

// Left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 5, 12),
    wallMaterial
);
leftWall.position.set(-8, 2.5, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);


// Modern window - Dining area
const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x292929,
    roughness: 0.45
});

const windowGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9fc1c7,
    metalness: 0.1,
    roughness: 0.15,
    transparent: true,
    opacity: 0.65
});

// Window glass
const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.4),
    windowGlassMaterial
);
windowGlass.position.set(3.5, 2.7, -5.86);
scene.add(windowGlass);

// Window frame
function addWindowFrame(width, height, x, y) {
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.08),
        windowFrameMaterial
    );
    frame.position.set(x, y, -5.82);
    scene.add(frame);
}

// Outer frame
addWindowFrame(3.3, 0.08, 3.5, 3.94);
addWindowFrame(3.3, 0.08, 3.5, 1.46);
addWindowFrame(0.08, 2.5, 1.85, 2.7);
addWindowFrame(0.08, 2.5, 5.15, 2.7);

// Middle divider
addWindowFrame(0.06, 2.4, 3.5, 2.7);



// Model loader
const loader = new GLTFLoader();

// Load and position a model
function loadModel(path, targetHeight, x, z, rotation = 0) {
    loader.load(
        path,
        (gltf) => {
            const model = gltf.scene;

            // Normalize model height
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());

            if (size.y <= 0) {
                console.error('Invalid model dimensions:', path);
                return;
            }

            const scale = targetHeight / size.y;
            model.scale.setScalar(scale);

            // Center model and place it on the floor
            const bounds = new THREE.Box3().setFromObject(model);
            const center = bounds.getCenter(new THREE.Vector3());

            model.position.set(
                x - center.x,
                -bounds.min.y,
                z - center.z
            );

            // Rotate around the model's center
            const group = new THREE.Group();
            group.position.set(x, 0, z);

            model.position.x -= x;
            model.position.z -= z;
            group.add(model);
            group.rotation.y = rotation;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(group);
            console.log('Loaded:', path);
        },
        undefined,
        (error) => {
            console.error('Error loading:', path, error);
        }
    );
}


// Dining area - right side of the room
loadModel('./assets/table.glb', 0.95, 3.5, 0);

// Four dining chairs facing the table
loadModel('./assets/chair.glb', 0.95, 1.9, 0, -Math.PI / 2);
loadModel('./assets/chair.glb', 0.95, 5.1, 0, Math.PI / 2);
loadModel('./assets/chair.glb', 0.95, 3.5, -1.6, Math.PI);
loadModel('./assets/chair.glb', 0.95, 3.5, 1.6, 0);





// Living area - Corner sofa
loadModel('./assets/modernsofa.glb', 1.35, -4.5, 0, Math.PI / 2);


// Living area - Coffee table
loadModel('./assets/coffeetable.glb', 0.45, -2.5, 0.5, 0);


// Living area - TV console
const consoleMaterial = new THREE.MeshStandardMaterial({
    color: 0x493124,
    roughness: 0.65
});

const tvConsole = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.55, 0.65),
    consoleMaterial
);
tvConsole.position.set(-3.5, 0.275, -5.4);
tvConsole.castShadow = true;
tvConsole.receiveShadow = true;
scene.add(tvConsole);

// TV screen
const tvMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.25
});

const tv = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.5, 0.08),
    tvMaterial
);
tv.position.set(-3.5, 1.4, -5.35);
tv.castShadow = true;
scene.add(tv);


// Decorative indoor plant
const plantGroup = new THREE.Group();
plantGroup.position.set(-6.8, 0, -4.8);

// Cream ceramic pot
const potMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8c8b5,
    roughness: 0.8
});

const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.22, 0.55, 24),
    potMaterial
);
pot.position.y = 0.28;
pot.castShadow = true;
plantGroup.add(pot);

// Plant stem
const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.055, 1.3, 12),
    new THREE.MeshStandardMaterial({ color: 0x51452f })
);
stem.position.y = 1.15;
plantGroup.add(stem);

// Olive green leaves
const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x526b3f,
    roughness: 0.85
});

for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;

    const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 10),
        leafMaterial
    );

    leaf.scale.set(0.65, 1.8, 0.45);
    leaf.position.set(
        Math.cos(angle) * 0.28,
        1.35 + (i % 3) * 0.18,
        Math.sin(angle) * 0.28
    );
    leaf.rotation.z = Math.cos(angle) * 0.45;
    leaf.rotation.x = Math.sin(angle) * 0.45;
    leaf.castShadow = true;

    plantGroup.add(leaf);
}

scene.add(plantGroup);


// Dining area - Modern pendant light
const pendantGroup = new THREE.Group();
pendantGroup.position.set(3.5, 0, 0);

// Ceiling cord
const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 1.1, 12),
    new THREE.MeshStandardMaterial({ color: 0x302820 })
);
cord.position.y = 4.45;
pendantGroup.add(cord);

// Lamp shade
const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.55, 0.35, 32, 1, true),
    new THREE.MeshStandardMaterial({
        color: 0x66513d,
        metalness: 0.55,
        roughness: 0.35,
        side: THREE.DoubleSide
    })
);
shade.position.y = 3.75;
shade.castShadow = true;
pendantGroup.add(shade);

// Warm light bulb
const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshStandardMaterial({
        color: 0xffe0aa,
        emissive: 0xffc77a,
        emissiveIntensity: 2
    })
);
bulb.position.y = 3.55;
pendantGroup.add(bulb);

// Warm light over dining table
const diningLight = new THREE.PointLight(
    0xffd6a0,
    25,
    6
);
diningLight.position.set(0, 3.5, 0);
pendantGroup.add(diningLight);

scene.add(pendantGroup);





// Living area - Modern cream rug
const rugGeometry = new THREE.BoxGeometry(6.5, 0.035, 4.8);

const rugMaterial = new THREE.MeshStandardMaterial({
    color: 0x69734c,
    roughness: 1
});

const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.position.set(-3.5, 0.025, 0.5);
rug.receiveShadow = true;
scene.add(rug);





// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
