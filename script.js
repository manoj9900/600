document.addEventListener('DOMContentLoaded', () => {
const canvas = document.getElementById('teak-3d-background');
if (!canvas) return;

let scene, camera, renderer, plates;
const plateCount = 60; 

function init() {
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);
camera.position.z = 60; 

renderer = new THREE.WebGLRenderer({
canvas: canvas,
antialias: true,
alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

window.addEventListener('resize', onWindowResize);

createWoodPlates();
}


const woodShader = {
uniforms: {
time: { value: 0 },
color1: { value: new THREE.Color("#8B5A2B") },
color2: { value: new THREE.Color("#C48A4A") },
},
vertexShader: `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader: `
varying vec2 vUv;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;

float grain(vec2 p) {
return sin(p.y * 40.0 + sin(p.x * 10.0) * 2.0);
}

void main() {
float g = grain(vUv + time * 0.02);
float mixVal = 0.5 + g * 0.25;
vec3 woodColor = mix(color1, color2, mixVal);
gl_FragColor = vec4(woodColor, 1.0);
}
`
};

function createWoodPlates() {
plates = new THREE.Group();

const geometry = new THREE.BoxGeometry(30, 12, 3);

for (let i = 0; i < plateCount; i++) {
const material = new THREE.ShaderMaterial({
uniforms: THREE.UniformsUtils.clone(woodShader.uniforms),
vertexShader: woodShader.vertexShader,
fragmentShader: woodShader.fragmentShader
});

const plate = new THREE.Mesh(geometry, material);


const zPos = THREE.MathUtils.randFloat(20, 70); 

plate.position.set(
(Math.random() - 0.5) * 240, 
(Math.random() - 0.5) * 240, 
zPos
);

plate.rotation.x = Math.random() * Math.PI;
plate.rotation.y = Math.random() * Math.PI;

plates.add(plate);
}

scene.add(plates);

const light = new THREE.DirectionalLight(0xffffff, 1.1);
light.position.set(40, 80, 70);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.45));
}

const clock = new THREE.Clock();

function animate() {
requestAnimationFrame(animate);

const t = clock.getElapsedTime();

plates.children.forEach(p => {
p.material.uniforms.time.value = t * 0.5; // 🔻 slower shader movement


// 🔻 MUCH slower movement
p.position.x -= 0.05;
p.position.y -= 0.025;


// 🔻 softer floating effect
p.position.z += Math.sin(t * 0.15 + p.id) * 0.03;


// 🔻 slower rotation (premium feel)
p.rotation.x += 0.0003;
p.rotation.y += 0.0005;


// reset position
if (p.position.x < -160) p.position.x = 160;
if (p.position.y < -160) p.position.y = 160;
});

renderer.render(scene, camera);
}

function onWindowResize() {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
});







document.querySelector(".menu-toggle").addEventListener("click", function() {
document.querySelector(".teak-navbar").classList.toggle("active");
});





      AOS.init({
        duration: 1000,
        once: true,     
      });