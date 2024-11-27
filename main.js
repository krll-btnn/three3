import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// Загрузка фона
const exrLoader = new EXRLoader();
exrLoader.load('./images/autumn_field_4k.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; // Установка отображения
  scene.background = texture; // Задать фон сцены
  scene.environment = texture; // Освещение от HDRI
});

// Отрисовщик
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Сцена
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 3, 20);

// Перемещение
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0;
controls.maxPolarAngle = 5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Освещение
const sunLight = new THREE.DirectionalLight(0xffffff, 1); // Цвет и интенсивность
sunLight.position.set(-50, 100, 50); // Позиция источника света
sunLight.castShadow = true;
scene.add(sunLight);

// Текст
const loader = new FontLoader();
loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
  const geometry = new TextGeometry("I have no enemies", {
    font: font,
    size: 2,
    height: 2,
    depth: 0.5,
    curveSegments: 15
  });

  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(geometry, material);

  // Центрируем текст
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  const xOffset = (boundingBox.max.x - boundingBox.min.x) / 2;
  textMesh.position.set(-xOffset, 1, 0);

  scene.add(textMesh);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();