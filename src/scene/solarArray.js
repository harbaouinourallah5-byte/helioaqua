import * as THREE from 'three';

/**
 * Solar Array Component
 * Creates modular photovoltaic panel racks that tilt towards the sun,
 * pulse with energy, and expand dynamically as business sales increase.
 */
export class SolarArray {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(-25, 0, -8);
    this.scene.add(this.group);

    this.racks = [];
    this.panelMaterials = [];
    this.createRacks();
  }

  createRacks() {
    // 4 rows of solar racks. Each rack has 4 solar panels.
    const rackSpacingZ = 4.2;

    for (let r = 0; r < 4; r++) {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(0, 0, r * rackSpacingZ);

      // Support metal structure
      const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      
      const frontLegGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.0);
      const backLegGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.0);

      // 3 support trestles per rack
      for (let leg = -1; leg <= 1; leg++) {
        const xPos = leg * 3.8;

        const fLeg = new THREE.Mesh(frontLegGeom, legMat);
        fLeg.position.set(xPos, 0.5, 1.0);
        fLeg.castShadow = true;
        rackGroup.add(fLeg);

        const bLeg = new THREE.Mesh(backLegGeom, legMat);
        bLeg.position.set(xPos, 1.0, -1.0);
        bLeg.castShadow = true;
        rackGroup.add(bLeg);

        // Cross beam
        const beamGeom = new THREE.BoxGeometry(0.1, 0.1, 2.4);
        const beam = new THREE.Mesh(beamGeom, legMat);
        beam.position.set(xPos, 1.25, 0);
        beam.rotation.x = Math.PI / 6; // 30 degree tilt
        beam.castShadow = true;
        rackGroup.add(beam);
      }

      // 4 Solar Panels mounted on the rack
      const panelGeom = new THREE.BoxGeometry(2.1, 0.08, 1.9);
      const borderMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

      for (let p = 0; p < 4; p++) {
        const pGroup = new THREE.Group();
        pGroup.position.set(-3.4 + p * 2.3, 1.25, 0);
        pGroup.rotation.x = Math.PI / 6; // Tilt facing South

        // Aluminum frame
        const frame = new THREE.Mesh(panelGeom, borderMat);
        frame.castShadow = true;
        pGroup.add(frame);

        // Blue PV glass surface
        const glassGeom = new THREE.PlaneGeometry(1.98, 1.78);
        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x1d4ed8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.2,
          roughness: 0.15,
          metalness: 0.6
        });
        this.panelMaterials.push(glassMat);

        const glass = new THREE.Mesh(glassGeom, glassMat);
        glass.rotation.x = -Math.PI / 2;
        glass.position.y = 0.045;
        pGroup.add(glass);

        rackGroup.add(pGroup);
      }

      this.group.add(rackGroup);
      this.racks.push(rackGroup);
    }

    // Default: 2 racks visible for 10 installations
    this.updateVisibility(10);
  }

  updateVisibility(installationsCount) {
    // 1-4 installations: 1 rack
    // 5-8 installations: 2 racks
    // 9-14 installations: 3 racks
    // 15-20 installations: 4 racks
    let activeRacks = 1;
    if (installationsCount >= 15) activeRacks = 4;
    else if (installationsCount >= 9) activeRacks = 3;
    else if (installationsCount >= 5) activeRacks = 2;

    this.racks.forEach((rack, idx) => {
      rack.visible = idx < activeRacks;
    });
  }

  update(sunIntensity, isDiesel, time) {
    // Pulse panel glow with sunlight
    const glow = (isDiesel ? 0.05 : (0.15 + sunIntensity * 0.45));
    const pulse = Math.sin(time * 3) * 0.08;

    this.panelMaterials.forEach(mat => {
      mat.emissiveIntensity = Math.max(0.02, glow + pulse);
      mat.color.setHex(isDiesel ? 0x1e293b : 0x1d4ed8);
    });
  }

  getWorldCenter() {
    return new THREE.Vector3(-25, 2, -4);
  }
}
