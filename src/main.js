import * as THREE from 'three';
import { SceneManager } from './scene/sceneManager.js';
import { LightsManager } from './scene/lights.js';
import { Environment } from './scene/environment.js';
import { SolarArray } from './scene/solarArray.js';
import { PumpAndTank } from './scene/pumpAndTank.js';
import { IrrigationAndCrops } from './scene/irrigationAndCrops.js';
import { PropsAndCharacters } from './scene/propsAndCharacters.js';
import { ParticleSystem } from './scene/particleSystem.js';
import { ChartRenderer } from './ui/chartRenderer.js';
import { UIController } from './ui/uiController.js';
import { TourManager } from './simulation/tourManager.js';

/**
 * HelioAqua 3D Simulation - Main Entry Point
 */
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  const hotspotsContainer = document.getElementById('hotspots-container');
  const chartSvg = document.getElementById('businessChartSvg');

  // 1. Reactive Application State
  const appState = {
    isDiesel: false,
    timeOfDay: 12.0,            // 6.0 (dawn) to 18.0 (dusk)
    sunIntensity: 1.0,          // 0.15 to 1.0
    installationsCount: 10,     // 1 to 20
    cropGrowth: 88,             // 0 to 100%
    dieselCost: 0,              // DT accumulated
    showLabels: true
  };

  // 2. Initialize 3D Engine
  const sceneManager = new SceneManager(container);
  const lights = new LightsManager(sceneManager.scene);
  const env = new Environment(sceneManager.scene);
  const solarArray = new SolarArray(sceneManager.scene);
  const pumpAndTank = new PumpAndTank(sceneManager.scene);
  const irrigation = new IrrigationAndCrops(sceneManager.scene);
  const characters = new PropsAndCharacters(sceneManager.scene);
  const particles = new ParticleSystem(sceneManager.scene);

  // 3. Register 3D Clickable Hotspots
  sceneManager.registerHotspot(
    'solar',
    new THREE.Vector3(-25, 3.2, -4),
    'Panneaux Solaires',
    '☀️',
    () => sceneManager.animateCameraTo(new THREE.Vector3(-25, 18, 8), new THREE.Vector3(-25, 1, -4), 1.2)
  );

  sceneManager.registerHotspot(
    'pump',
    new THREE.Vector3(-11, 3.5, -2),
    'Station de Pompage',
    '⚙️',
    () => sceneManager.animateCameraTo(new THREE.Vector3(-11, 14, 10), new THREE.Vector3(-11, 1.5, -2), 1.2)
  );

  sceneManager.registerHotspot(
    'tank',
    new THREE.Vector3(-7.5, 4.8, -5.5),
    'Réservoir Tampon',
    '💧',
    () => sceneManager.animateCameraTo(new THREE.Vector3(-5, 15, 8), new THREE.Vector3(-7.5, 3, -5.5), 1.2)
  );

  sceneManager.registerHotspot(
    'drip',
    new THREE.Vector3(4, 1.2, -6),
    'Réseau Goutte-à-Goutte',
    '🌿',
    () => sceneManager.animateCameraTo(new THREE.Vector3(4, 12, 6), new THREE.Vector3(4, 0.5, -6), 1.2)
  );

  sceneManager.registerHotspot(
    'crops',
    new THREE.Vector3(14, 2.0, 4),
    'Cultures & Fellah',
    '🍅',
    () => sceneManager.animateCameraTo(new THREE.Vector3(12, 16, 20), new THREE.Vector3(14, 1, 4), 1.2)
  );

  sceneManager.initHotspots(hotspotsContainer);

  // 4. Initialize UI and Guided Tour
  const chartRenderer = new ChartRenderer(chartSvg);
  const ui = new UIController(appState, chartRenderer);
  const tour = new TourManager(sceneManager, ui.el);

  // Reset Camera button binding
  ui.el.btnResetCamera.addEventListener('click', () => sceneManager.resetCamera());

  // 5. Main 60 FPS Render Loop
  let lastTime = performance.now();

  function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Calculate effective solar factor
    const hourNorm = (appState.timeOfDay - 6) / 12;
    const sunElevation = Math.max(0, Math.sin(hourNorm * Math.PI));
    const effectiveSolar = appState.isDiesel ? 0 : (sunElevation * appState.sunIntensity);

    // Update 3D Modules
    lights.updateSun(appState.timeOfDay, appState.sunIntensity);
    solarArray.update(appState.sunIntensity, appState.isDiesel, now * 0.001);
    solarArray.updateVisibility(appState.installationsCount);
    pumpAndTank.update(appState.isDiesel, now * 0.001);
    irrigation.updateVisibility(appState.installationsCount);
    irrigation.updateGrowth(appState.cropGrowth);
    particles.update(dt, appState.isDiesel, effectiveSolar);

    // Update UI telemetry metrics
    ui.updateMetrics(effectiveSolar, dt);

    // Render Scene & Camera Flight
    sceneManager.update(dt);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
