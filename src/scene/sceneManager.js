import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * SceneManager
 * Coordinates WebGL rendering, camera setup, OrbitControls, and 2D hotspot projections.
 */
export class SceneManager {
  constructor(container) {
    this.container = container;

    // 1. Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdbeafe);
    this.scene.fog = new THREE.FogExp2(0xdbeafe, 0.007);

    // 2. Create Camera (Tilted top-down / drone bird's-eye view ~65°)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 300);
    this.defaultCamPos = new THREE.Vector3(0, 52, 38);
    this.defaultCamTarget = new THREE.Vector3(0, 0, 0);
    this.camera.position.copy(this.defaultCamPos);
    this.camera.lookAt(this.defaultCamTarget);

    // 3. Create WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls (Smooth, restricted to bird's-eye view range)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2.3; // Prevent going underground
    this.controls.minPolarAngle = Math.PI / 8;   // Allow top-down looking down
    this.controls.minDistance = 15;
    this.controls.maxDistance = 140;
    this.controls.target.copy(this.defaultCamTarget);

    // 5. Hotspots registry
    this.hotspots = [];

    // Resize handling
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  registerHotspot(id, worldPos, title, icon, onClick) {
    this.hotspots.push({ id, worldPos, title, icon, onClick, el: null });
  }

  initHotspots(containerEl) {
    containerEl.innerHTML = '';
    this.hotspots.forEach(h => {
      const btn = document.createElement('div');
      btn.className = 'hotspot-label';
      btn.id = `hotspot-${h.id}`;
      btn.innerHTML = `<span>${h.icon}</span> <span>${h.title}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (h.onClick) h.onClick();
      });
      containerEl.appendChild(btn);
      h.el = btn;
    });
  }

  updateHotspots() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.hotspots.forEach(h => {
      if (!h.el) return;
      const pos = h.worldPos.clone().project(this.camera);

      // Check if behind camera
      if (pos.z > 1) {
        h.el.style.display = 'none';
        return;
      }

      h.el.style.display = 'flex';
      const screenX = (pos.x * 0.5 + 0.5) * width;
      const screenY = (-(pos.y * 0.5) + 0.5) * height;
      h.el.style.left = `${screenX}px`;
      h.el.style.top = `${screenY}px`;
    });
  }

  resetCamera() {
    this.animateCameraTo(this.defaultCamPos, this.defaultCamTarget, 1.2);
  }

  animateCameraTo(targetPos, targetLookAt, duration = 1.0) {
    this.animatingCamera = {
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startLook: this.controls.target.clone(),
      endLook: targetLookAt.clone(),
      startTime: performance.now(),
      duration: duration * 1000
    };
  }

  update(dt) {
    // Handle smooth camera flight
    if (this.animatingCamera) {
      const elapsed = performance.now() - this.animatingCamera.startTime;
      const progress = Math.min(elapsed / this.animatingCamera.duration, 1.0);
      
      // Smooth cubic easeInOut
      const t = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(this.animatingCamera.startPos, this.animatingCamera.endPos, t);
      this.controls.target.lerpVectors(this.animatingCamera.startLook, this.animatingCamera.endLook, t);

      if (progress >= 1.0) {
        this.animatingCamera = null;
      }
    }

    this.controls.update();
    this.updateHotspots();
    this.renderer.render(this.scene, this.camera);
  }
}
