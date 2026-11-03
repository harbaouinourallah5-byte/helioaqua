import * as THREE from 'three';

/**
 * Irrigation Network and Agricultural Plots
 * Manages crop field plots, drip irrigation tubing, soil moistening,
 * and instanced crop growth corresponding to business expansion.
 */
export class IrrigationAndCrops {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.plots = [];
    this.cropInstances = [];
    this.pipeGroup = new THREE.Group();
    this.group.add(this.pipeGroup);

    this.createPlots();
    this.createMainPipes();
  }

  createPlots() {
    // We define 4 modular agricultural plots:
    // Plot 0: Main plot (x: 4, z: -8)
    // Plot 1: Plot right (x: 24, z: -8) - unlocks at >= 5 installations
    // Plot 2: Plot south-left (x: 4, z: 14) - unlocks at >= 10 installations
    // Plot 3: Plot south-right (x: 24, z: 14) - unlocks at >= 15 installations

    const plotConfigs = [
      { x: 4, z: -8, minInstalls: 1 },
      { x: 26, z: -8, minInstalls: 5 },
      { x: 4, z: 16, minInstalls: 10 },
      { x: 26, z: 16, minInstalls: 15 }
    ];

    plotConfigs.forEach((cfg, idx) => {
      const plotGroup = new THREE.Group();
      plotGroup.position.set(cfg.x, 0, cfg.z);

      // 1. Soil Bed
      const bedGeom = new THREE.BoxGeometry(18, 0.25, 18);
      const bedMat = new THREE.MeshStandardMaterial({
        color: 0x5c3317, // Rich agricultural soil
        roughness: 0.95
      });
      const bed = new THREE.Mesh(bedGeom, bedMat);
      bed.position.y = 0.125;
      bed.receiveShadow = true;
      plotGroup.add(bed);

      // Moist soil stripe under crop rows
      const moistMat = new THREE.MeshStandardMaterial({
        color: 0x2e1808, // Dark wet soil
        roughness: 0.9
      });
      plotGroup.userData.moistMat = moistMat;

      // 4 crop rows per plot
      const cropRows = 4;
      const plantsPerRow = 6;
      const rowSpacing = 4.0;
      const plantSpacing = 2.6;

      const plotCropMeshes = [];

      // Create low-poly crop plant geometry (InstancedMesh)
      // Compound crop geometry: green leafy bush + red tomatoes
      const plantStemGeom = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 5);
      const plantBushGeom = new THREE.DodecahedronGeometry(0.7);
      const tomatoGeom = new THREE.SphereGeometry(0.18, 6, 6);

      const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
      const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });

      // Instanced Mesh for plant bodies
      const totalPlants = cropRows * plantsPerRow;
      const instancedPlants = new THREE.InstancedMesh(plantBushGeom, leafMat, totalPlants);
      instancedPlants.castShadow = true;
      instancedPlants.receiveShadow = true;

      const instancedTomatoes = new THREE.InstancedMesh(tomatoGeom, tomatoMat, totalPlants * 2);
      instancedTomatoes.castShadow = true;

      let pIdx = 0;
      const dummy = new THREE.Object3D();

      for (let r = 0; r < cropRows; r++) {
        const rowZ = -6.0 + r * rowSpacing;

        // Black drip tape line along row
        const dripLineGeom = new THREE.CylinderGeometry(0.05, 0.05, 16.5, 6);
        const dripLineMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        const dripLine = new THREE.Mesh(dripLineGeom, dripLineMat);
        dripLine.rotation.z = Math.PI / 2;
        dripLine.position.set(0, 0.28, rowZ);
        plotGroup.add(dripLine);

        // Wet soil stripe along row
        const stripeGeom = new THREE.PlaneGeometry(16.5, 1.2);
        const stripe = new THREE.Mesh(stripeGeom, moistMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(0, 0.26, rowZ);
        stripe.receiveShadow = true;
        plotGroup.add(stripe);

        // Plants along row
        for (let p = 0; p < plantsPerRow; p++) {
          const plantX = -6.5 + p * plantSpacing;
          
          dummy.position.set(plantX, 0.7, rowZ);
          dummy.scale.set(0.8, 0.8, 0.8);
          dummy.updateMatrix();
          instancedPlants.setMatrixAt(pIdx, dummy.matrix);

          // Tomato 1
          dummy.position.set(plantX - 0.25, 0.6, rowZ + 0.3);
          dummy.scale.set(0.8, 0.8, 0.8);
          dummy.updateMatrix();
          instancedTomatoes.setMatrixAt(pIdx * 2, dummy.matrix);

          // Tomato 2
          dummy.position.set(plantX + 0.3, 0.55, rowZ - 0.25);
          dummy.scale.set(0.8, 0.8, 0.8);
          dummy.updateMatrix();
          instancedTomatoes.setMatrixAt(pIdx * 2 + 1, dummy.matrix);

          pIdx++;
        }
      }

      instancedPlants.instanceMatrix.needsUpdate = true;
      instancedTomatoes.instanceMatrix.needsUpdate = true;

      plotGroup.add(instancedPlants);
      plotGroup.add(instancedTomatoes);

      plotGroup.userData.minInstalls = cfg.minInstalls;
      plotGroup.userData.instancedPlants = instancedPlants;
      plotGroup.userData.instancedTomatoes = instancedTomatoes;

      this.group.add(plotGroup);
      this.plots.push(plotGroup);
    });

    this.updateVisibility(10);
  }

  createMainPipes() {
    // PVC / Metallic distribution pipe running from pump house (-8, 0.4, -3) to plots
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // HelioAqua Cyan/Blue pipe
      metalness: 0.6,
      roughness: 0.3
    });

    // 1. Manifold pipe extending eastward
    const mainPipeGeom = new THREE.CylinderGeometry(0.14, 0.14, 42, 12);
    const mainPipe = new THREE.Mesh(mainPipeGeom, pipeMat);
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(13, 0.35, -3);
    mainPipe.castShadow = true;
    this.pipeGroup.add(mainPipe);

    // 2. North-South distribution branches
    const branch1Geom = new THREE.CylinderGeometry(0.1, 0.1, 30, 8);
    const branch1 = new THREE.Mesh(branch1Geom, pipeMat);
    branch1.rotation.x = Math.PI / 2;
    branch1.position.set(-4.5, 0.3, 4);
    this.pipeGroup.add(branch1);

    const branch2 = new THREE.Mesh(branch1Geom, pipeMat);
    branch2.rotation.x = Math.PI / 2;
    branch2.position.set(17.5, 0.3, 4);
    this.pipeGroup.add(branch2);
  }

  updateVisibility(installationsCount) {
    this.plots.forEach(plot => {
      plot.visible = installationsCount >= plot.userData.minInstalls;
    });
  }

  updateGrowth(growthPercent) {
    // Scale instanced plants based on growth % (0.35 sprout to 1.15 lush plant)
    const scaleFactor = 0.35 + (growthPercent / 100) * 0.8;
    const tomatoScale = growthPercent > 65 ? (growthPercent - 65) / 35 : 0.001;

    this.plots.forEach(plot => {
      if (!plot.visible) return;
      const instPlants = plot.userData.instancedPlants;
      const instTomatoes = plot.userData.instancedTomatoes;

      const dummy = new THREE.Object3D();
      const count = 24;

      for (let i = 0; i < count; i++) {
        // Re-read matrix and update scale
        instPlants.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.scale.set(scaleFactor, scaleFactor, scaleFactor);
        dummy.updateMatrix();
        instPlants.setMatrixAt(i, dummy.matrix);

        // Tomatoes
        instTomatoes.getMatrixAt(i * 2, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.scale.set(tomatoScale, tomatoScale, tomatoScale);
        dummy.updateMatrix();
        instTomatoes.setMatrixAt(i * 2, dummy.matrix);

        instTomatoes.getMatrixAt(i * 2 + 1, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.scale.set(tomatoScale, tomatoScale, tomatoScale);
        dummy.updateMatrix();
        instTomatoes.setMatrixAt(i * 2 + 1, dummy.matrix);
      }

      instPlants.instanceMatrix.needsUpdate = true;
      instTomatoes.instanceMatrix.needsUpdate = true;
    });
  }

  getWorldCenter() {
    return new THREE.Vector3(12, 1.5, 4);
  }
}
