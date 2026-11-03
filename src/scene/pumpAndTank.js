import * as THREE from 'three';

/**
 * Pumping Station, Well and Water Buffer Tank
 * Models the hydraulic heart of the HelioAqua installation,
 * including the comparative diesel generator.
 */
export class PumpAndTank {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(-11, 0, -3);
    this.scene.add(this.group);

    this.createWell();
    this.createBufferTank();
    this.createPumpShelter();
    this.createDieselGenerator();
  }

  createWell() {
    // Traditional borehole / well with stone rim
    const wellGroup = new THREE.Group();
    wellGroup.position.set(-3.5, 0, 0);

    // Stone rim
    const rimGeom = new THREE.CylinderGeometry(1.6, 1.8, 0.8, 16);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.y = 0.4;
    rim.castShadow = true;
    rim.receiveShadow = true;
    wellGroup.add(rim);

    // Deep water interior
    const waterGeom = new THREE.CircleGeometry(1.3, 16);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.25;
    wellGroup.add(water);

    // Suction pipe descending into well
    const pipeGeom = new THREE.CylinderGeometry(0.12, 0.12, 2.0);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const pipe = new THREE.Mesh(pipeGeom, pipeMat);
    pipe.position.set(0, 0.8, 0);
    wellGroup.add(pipe);

    this.group.add(wellGroup);
  }

  createBufferTank() {
    // Cylindrical blue water storage reservoir
    const tankGroup = new THREE.Group();
    tankGroup.position.set(3.5, 0, -2.5);

    // Concrete base
    const baseGeom = new THREE.CylinderGeometry(2.2, 2.4, 0.4, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.y = 0.2;
    base.receiveShadow = true;
    tankGroup.add(base);

    // Main tank body
    const bodyGeom = new THREE.CylinderGeometry(2.0, 2.0, 4.2, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.4,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 2.5;
    body.castShadow = true;
    body.receiveShadow = true;
    tankGroup.add(body);

    // Tank dome roof
    const domeGeom = new THREE.SphereGeometry(2.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeom, bodyMat);
    dome.position.y = 4.6;
    dome.castShadow = true;
    tankGroup.add(dome);

    // HelioAqua white branding band
    const bandGeom = new THREE.CylinderGeometry(2.02, 2.02, 0.8, 20);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const band = new THREE.Mesh(bandGeom, bandMat);
    band.position.y = 2.8;
    tankGroup.add(band);

    this.group.add(tankGroup);
  }

  createPumpShelter() {
    // Pump House / Technical Room with solar inverter
    const shelterGroup = new THREE.Group();
    shelterGroup.position.set(0, 0, 0);

    // Walls
    const wallGeom = new THREE.BoxGeometry(3.6, 2.8, 3.0);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
    const walls = new THREE.Mesh(wallGeom, wallMat);
    walls.position.y = 1.4;
    walls.castShadow = true;
    walls.receiveShadow = true;
    shelterGroup.add(walls);

    // Slanted tin roof
    const roofGeom = new THREE.BoxGeometry(4.2, 0.2, 3.6);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.set(0, 2.9, 0);
    roof.rotation.z = -0.08;
    roof.castShadow = true;
    shelterGroup.add(roof);

    // Door & Inverter Box on outer wall
    const inverterGeom = new THREE.BoxGeometry(0.9, 1.2, 0.3);
    const inverterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const inverter = new THREE.Mesh(inverterGeom, inverterMat);
    inverter.position.set(0, 1.5, 1.6);
    shelterGroup.add(inverter);

    // Glowing LED status indicator
    const ledGeom = new THREE.SphereGeometry(0.08, 8, 8);
    this.ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const led = new THREE.Mesh(ledGeom, this.ledMat);
    led.position.set(0.2, 1.8, 1.76);
    shelterGroup.add(led);

    this.group.add(shelterGroup);
  }

  createDieselGenerator() {
    // Diesel generator unit (activated in diesel mode)
    this.dieselGroup = new THREE.Group();
    this.dieselGroup.position.set(-1.8, 0, 3.2);

    // Generator housing
    const genGeom = new THREE.BoxGeometry(2.0, 1.3, 1.4);
    const genMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.4 });
    const gen = new THREE.Mesh(genGeom, genMat);
    gen.position.y = 0.65;
    gen.castShadow = true;
    this.dieselGroup.add(gen);

    // Diesel fuel drum (barrel)
    const drumGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12);
    const drumMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const drum = new THREE.Mesh(drumGeom, drumMat);
    drum.position.set(1.6, 0.7, 0);
    drum.castShadow = true;
    this.dieselGroup.add(drum);

    // Vertical exhaust chimney pipe
    const exhaustGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.2);
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const exhaust = new THREE.Mesh(exhaustGeom, exhaustMat);
    exhaust.position.set(-0.6, 1.8, -0.4);
    exhaust.castShadow = true;
    this.dieselGroup.add(exhaust);

    // Exhaust tip world position
    this.exhaustTip = new THREE.Vector3();

    this.dieselGroup.visible = false; // Hidden in solar mode
    this.group.add(this.dieselGroup);
  }

  update(isDiesel, time) {
    this.dieselGroup.visible = isDiesel;
    this.ledMat.color.setHex(isDiesel ? 0xef4444 : 0x22c55e);

    // Subtle vibration shake when diesel is running
    if (isDiesel) {
      this.dieselGroup.position.y = Math.sin(time * 40) * 0.02;
    } else {
      this.dieselGroup.position.y = 0;
    }
  }

  getExhaustPosition() {
    return new THREE.Vector3(-13.4, 2.9, 0.2);
  }

  getWorldCenter() {
    return new THREE.Vector3(-11, 2, -3);
  }

  getTankCenter() {
    return new THREE.Vector3(-7.5, 3, -5.5);
  }
}
