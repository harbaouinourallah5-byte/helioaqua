import * as THREE from 'three';

/**
 * Characters and Service Vehicles
 * Adds the HelioAqua service utility pickup, technician figure, and farmer figure.
 */
export class PropsAndCharacters {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createTechnicianVan();
    this.createTechnician();
    this.createFarmer();
  }

  createTechnicianVan() {
    // Stylized low-poly HelioAqua Service Utility Pickup
    const vanGroup = new THREE.Group();
    vanGroup.position.set(-18, 0, 14);
    vanGroup.rotation.y = Math.PI / 12; // Parked diagonally along dirt road

    // Car Body Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const blueStripeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Chassis / Cabin
    const cabinGeom = new THREE.BoxGeometry(2.2, 1.3, 2.0);
    const cabin = new THREE.Mesh(cabinGeom, bodyMat);
    cabin.position.set(0, 1.15, 0.4);
    cabin.castShadow = true;
    vanGroup.add(cabin);

    // Front Hood
    const hoodGeom = new THREE.BoxGeometry(2.18, 0.8, 1.4);
    const hood = new THREE.Mesh(hoodGeom, bodyMat);
    hood.position.set(0, 0.9, -1.3);
    hood.castShadow = true;
    vanGroup.add(hood);

    // Cyan/Blue side stripe
    const stripeGeom = new THREE.BoxGeometry(2.22, 0.3, 3.6);
    const stripe = new THREE.Mesh(stripeGeom, blueStripeMat);
    stripe.position.set(0, 0.9, 0);
    vanGroup.add(stripe);

    // Windshield
    const windshieldGeom = new THREE.BoxGeometry(2.0, 0.7, 0.1);
    const windshield = new THREE.Mesh(windshieldGeom, windowMat);
    windshield.position.set(0, 1.45, -0.6);
    windshield.rotation.x = 0.3;
    vanGroup.add(windshield);

    // Pickup Bed in rear
    const bedGeom = new THREE.BoxGeometry(2.18, 0.9, 1.8);
    const bed = new THREE.Mesh(bedGeom, bodyMat);
    bed.position.set(0, 0.95, 2.1);
    bed.castShadow = true;
    vanGroup.add(bed);

    // Spare solar panel loaded in pickup bed
    const sparePanelGeom = new THREE.BoxGeometry(1.6, 0.06, 1.4);
    const sparePanelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2 });
    const sparePanel = new THREE.Mesh(sparePanelGeom, sparePanelMat);
    sparePanel.position.set(0, 1.3, 2.1);
    sparePanel.rotation.x = -0.2;
    vanGroup.add(sparePanel);

    // 4 Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12);
    const wheelPositions = [
      { x: -1.15, z: -1.0 },
      { x: 1.15, z: -1.0 },
      { x: -1.15, z: 1.9 },
      { x: 1.15, z: 1.9 }
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, 0.42, pos.z);
      wheel.castShadow = true;
      vanGroup.add(wheel);
    });

    // Headlights
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), lightMat);
    h1.position.set(-0.7, 0.9, -2.01);
    vanGroup.add(h1);
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), lightMat);
    h2.position.set(0.7, 0.9, -2.01);
    vanGroup.add(h2);

    this.group.add(vanGroup);
  }

  createTechnician() {
    // HelioAqua Field Technician near the pump house
    const techGroup = new THREE.Group();
    techGroup.position.set(-8.5, 0, 1.2);
    techGroup.rotation.y = -Math.PI / 3;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 }); // High-vis vest

    // Legs
    const legGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.8);
    const legL = new THREE.Mesh(legGeom, pantsMat);
    legL.position.set(-0.16, 0.4, 0);
    legL.castShadow = true;
    techGroup.add(legL);

    const legR = new THREE.Mesh(legGeom, pantsMat);
    legR.position.set(0.16, 0.4, 0);
    legR.castShadow = true;
    techGroup.add(legR);

    // Torso with safety vest
    const torsoGeom = new THREE.BoxGeometry(0.5, 0.7, 0.3);
    const torso = new THREE.Mesh(torsoGeom, vestMat);
    torso.position.set(0, 1.15, 0);
    torso.castShadow = true;
    techGroup.add(torso);

    // Head + Safety Helmet
    const headGeom = new THREE.SphereGeometry(0.18, 12, 12);
    const head = new THREE.Mesh(headGeom, skinMat);
    head.position.set(0, 1.65, 0);
    techGroup.add(head);

    const helmetGeom = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const helmet = new THREE.Mesh(helmetGeom, helmetMat);
    helmet.position.set(0, 1.7, 0);
    techGroup.add(helmet);

    // Diagnostic Tablet in hand
    const tabletGeom = new THREE.BoxGeometry(0.3, 0.4, 0.04);
    const tabletMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const tablet = new THREE.Mesh(tabletGeom, tabletMat);
    tablet.position.set(0.22, 1.1, 0.28);
    tablet.rotation.x = -0.4;
    techGroup.add(tablet);

    this.group.add(techGroup);
  }

  createFarmer() {
    // Tunisian Farmer ("Fellah") standing by the crop plot
    const farmerGroup = new THREE.Group();
    farmerGroup.position.set(2.5, 0, 5.0);
    farmerGroup.rotation.y = Math.PI / 4;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.7 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.8 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.9 });

    // Legs
    const legGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.8);
    const legL = new THREE.Mesh(legGeom, clothesMat);
    legL.position.set(-0.16, 0.4, 0);
    farmerGroup.add(legL);

    const legR = new THREE.Mesh(legGeom, clothesMat);
    legR.position.set(0.16, 0.4, 0);
    farmerGroup.add(legR);

    // Torso + traditional vest
    const torsoGeom = new THREE.BoxGeometry(0.5, 0.7, 0.32);
    const torso = new THREE.Mesh(torsoGeom, vestMat);
    torso.position.set(0, 1.15, 0);
    torso.castShadow = true;
    farmerGroup.add(torso);

    // Head
    const headGeom = new THREE.SphereGeometry(0.18, 12, 12);
    const head = new THREE.Mesh(headGeom, skinMat);
    head.position.set(0, 1.65, 0);
    farmerGroup.add(head);

    // Traditional Tunisian Straw Hat / Chéchia
    const brimGeom = new THREE.CylinderGeometry(0.42, 0.45, 0.06, 14);
    const brim = new THREE.Mesh(brimGeom, hatMat);
    brim.position.set(0, 1.76, 0);
    farmerGroup.add(brim);

    const crownGeom = new THREE.CylinderGeometry(0.24, 0.26, 0.2, 12);
    const crown = new THREE.Mesh(crownGeom, hatMat);
    crown.position.set(0, 1.88, 0);
    farmerGroup.add(crown);

    this.group.add(farmerGroup);
  }
}
