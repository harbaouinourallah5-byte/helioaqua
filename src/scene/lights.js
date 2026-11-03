import * as THREE from 'three';

/**
 * Lighting and Day/Night Environment
 * Controls sun trajectory, directional shadows, and atmospheric colors.
 */
export class LightsManager {
  constructor(scene) {
    this.scene = scene;

    // 1. Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(this.ambientLight);

    // 2. Hemisphere Light (Sky & warm earth bounce)
    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xd97706, 0.4);
    this.hemiLight.position.set(0, 50, 0);
    scene.add(this.hemiLight);

    // 3. Directional Sun Light (Shadow Caster)
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 160;
    this.sunLight.shadow.camera.left = -50;
    this.sunLight.shadow.camera.right = 50;
    this.sunLight.shadow.camera.top = 50;
    this.sunLight.shadow.camera.bottom = -50;
    this.sunLight.shadow.bias = -0.0006;
    scene.add(this.sunLight);

    // 4. Visible Sun Orb
    const sunGeom = new THREE.SphereGeometry(2.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    this.sunMesh = new THREE.Mesh(sunGeom, sunMat);
    scene.add(this.sunMesh);

    // Initial position
    this.updateSun(12, 1.0);
  }

  updateSun(timeOfDay, sunIntensity) {
    // timeOfDay: 6.0 (dawn) to 18.0 (dusk)
    const norm = (timeOfDay - 6) / 12; // 0 to 1
    const angle = norm * Math.PI; // 0 at dawn, PI/2 at midday, PI at dusk

    // Sun trajectory coordinates
    const radius = 70;
    const x = -Math.cos(angle) * radius;
    const y = Math.max(8, Math.sin(angle) * radius * 0.9);
    const z = -Math.sin(angle) * 30 + 10;

    this.sunLight.position.set(x, y, z);
    this.sunLight.target.position.set(0, 0, 0);
    this.sunLight.target.updateMatrixWorld();

    this.sunMesh.position.set(x * 1.15, y * 1.15, z * 1.15);

    // Sun brightness based on elevation & cloud intensity
    const elevation = Math.sin(angle);
    const effectiveIntensity = Math.max(0.1, elevation * sunIntensity);

    this.sunLight.intensity = effectiveIntensity * 2.0;
    this.ambientLight.intensity = 0.35 + (effectiveIntensity * 0.45);
    this.hemiLight.intensity = 0.2 + (effectiveIntensity * 0.3);

    // Sky & Fog color transitions
    let skyColor = new THREE.Color(0xdbeafe);
    let fogDensity = 0.007;

    if (timeOfDay < 7.5) {
      // Dawn / Aube
      const t = (timeOfDay - 6) / 1.5;
      skyColor.lerpColors(new THREE.Color(0xfbcfe8), new THREE.Color(0xdbeafe), t);
      this.sunLight.color.setHex(0xfed7aa);
    } else if (timeOfDay > 16.5) {
      // Dusk / Crépuscule
      const t = (timeOfDay - 16.5) / 1.5;
      skyColor.lerpColors(new THREE.Color(0xdbeafe), new THREE.Color(0xfb923c), t);
      this.sunLight.color.setHex(0xf97316);
    } else {
      // Daytime
      skyColor.setHex(0xdbeafe);
      this.sunLight.color.setHex(0xfffbeb);
    }

    // Cloud cover greying effect
    if (sunIntensity < 0.7) {
      const grey = new THREE.Color(0x94a3b8);
      skyColor.lerp(grey, (0.7 - sunIntensity) * 0.8);
      fogDensity = 0.01;
    }

    this.scene.background = skyColor;
    if (this.scene.fog) {
      this.scene.fog.color = skyColor;
      this.scene.fog.density = fogDensity;
    }
  }
}
