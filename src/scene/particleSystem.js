import * as THREE from 'three';

/**
 * Animated Flow Particle Systems
 * 1. Solar electrical energy sparks from panels to inverter
 * 2. Water pulses through main hydraulic pipes to drip lines
 * 3. Volumetric dark smoke particles for Diesel comparison mode
 */
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createEnergyParticles();
    this.createWaterParticles();
    this.createDieselSmoke();
  }

  createEnergyParticles() {
    // Conduit from solar array (-20, 0.4, -4) to pump inverter (-11, 1.4, -3)
    this.energyCount = 20;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.energyCount * 3);

    for (let i = 0; i < this.energyCount; i++) {
      positions[i * 3] = -20 + (i / this.energyCount) * 9;
      positions[i * 3 + 1] = 0.4 + (i / this.energyCount) * 0.8;
      positions[i * 3 + 2] = -4 + (i / this.energyCount) * 1;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xfbbf24, // Bright solar amber
      size: 0.65,
      transparent: true,
      opacity: 0.85
    });

    this.energyPoints = new THREE.Points(geom, mat);
    this.group.add(this.energyPoints);
  }

  createWaterParticles() {
    // Water traveling along main distribution line from pump to fields
    this.waterCount = 35;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.waterCount * 3);

    for (let i = 0; i < this.waterCount; i++) {
      positions[i * 3] = -8 + (i / this.waterCount) * 38;
      positions[i * 3 + 1] = 0.42;
      positions[i * 3 + 2] = -3;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8, // Crisp water cyan
      size: 0.55,
      transparent: true,
      opacity: 0.9
    });

    this.waterPoints = new THREE.Points(geom, mat);
    this.group.add(this.waterPoints);
  }

  createDieselSmoke() {
    // Billowing smoke particles above generator exhaust (-13.4, 2.9, 0.2)
    this.smokeCount = 30;
    this.smokeParticles = [];

    const geom = new THREE.DodecahedronGeometry(0.35);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.6,
      roughness: 0.9
    });

    this.smokeInstanced = new THREE.InstancedMesh(geom, mat, this.smokeCount);
    this.smokeInstanced.visible = false;
    this.group.add(this.smokeInstanced);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.smokeCount; i++) {
      const p = {
        x: -13.4,
        y: 2.9,
        z: 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.8 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 0.4,
        scale: 0.4 + Math.random() * 0.4,
        maxLife: 1.5 + Math.random() * 1.0,
        life: Math.random() * 2.0
      };
      this.smokeParticles.push(p);

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      this.smokeInstanced.setMatrixAt(i, dummy.matrix);
    }
  }

  update(dt, isDiesel, effectiveSolar) {
    // 1. Update Energy Particles (active only in Solar mode)
    if (this.energyPoints) {
      if (isDiesel || effectiveSolar < 0.1) {
        this.energyPoints.visible = false;
      } else {
        this.energyPoints.visible = true;
        const posAttr = this.energyPoints.geometry.attributes.position;
        const speed = 7.0 * dt * effectiveSolar;

        for (let i = 0; i < this.energyCount; i++) {
          let x = posAttr.getX(i) + speed;
          if (x > -11) x = -20;
          posAttr.setX(i, x);
          
          const progress = (x - (-20)) / 9;
          posAttr.setY(i, 0.4 + progress * 0.9);
          posAttr.setZ(i, -4 + progress * 1.0);
        }
        posAttr.needsUpdate = true;
      }
    }

    // 2. Update Water Particles (active when pump is running)
    const isPumping = isDiesel || effectiveSolar > 0.15;
    if (this.waterPoints) {
      if (!isPumping) {
        this.waterPoints.visible = false;
      } else {
        this.waterPoints.visible = true;
        const posAttr = this.waterPoints.geometry.attributes.position;
        const speed = 11.0 * dt * (isDiesel ? 0.9 : effectiveSolar);

        for (let i = 0; i < this.waterCount; i++) {
          let x = posAttr.getX(i) + speed;
          if (x > 32) x = -8;
          posAttr.setX(i, x);
        }
        posAttr.needsUpdate = true;
      }
    }

    // 3. Update Diesel Smoke (active only in Diesel mode)
    if (this.smokeInstanced) {
      this.smokeInstanced.visible = isDiesel;

      if (isDiesel) {
        const dummy = new THREE.Object3D();
        const originX = -13.4;
        const originY = 2.9;
        const originZ = 0.2;

        this.smokeParticles.forEach((p, idx) => {
          p.life += dt;
          if (p.life > p.maxLife) {
            p.life = 0;
            p.x = originX;
            p.y = originY;
            p.z = originZ;
            p.scale = 0.4;
          }

          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.scale += dt * 0.6;

          dummy.position.set(p.x, p.y, p.z);
          dummy.scale.setScalar(p.scale);
          dummy.updateMatrix();
          this.smokeInstanced.setMatrixAt(idx, dummy.matrix);
        });

        this.smokeInstanced.instanceMatrix.needsUpdate = true;
      }
    }
  }
}
