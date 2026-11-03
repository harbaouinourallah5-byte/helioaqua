import * as THREE from 'three';

/**
 * Environment & Ground Layout
 * Creates terrain, perimeter borders, dirt access roads, and decorative Tunisian trees.
 */
export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createTerrain();
    this.createRoadAndPaths();
    this.createPerimeterWalls();
    this.createTrees();
  }

  createTerrain() {
    // 1. Base desert/rural landscape
    const groundGeom = new THREE.PlaneGeometry(160, 160, 24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // Burlywood / warm Tunisian sand
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.group.add(ground);

    // 2. Central Farm Enclosure Floor
    const farmFloorGeom = new THREE.PlaneGeometry(86, 64);
    const farmFloorMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.85
    });
    const farmFloor = new THREE.Mesh(farmFloorGeom, farmFloorMat);
    farmFloor.rotation.x = -Math.PI / 2;
    farmFloor.position.set(4, 0, 8);
    farmFloor.receiveShadow = true;
    this.group.add(farmFloor);
  }

  createRoadAndPaths() {
    // Dirt access road for the technician van
    const roadGeom = new THREE.PlaneGeometry(8, 70);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0xc89d66,
      roughness: 0.95
    });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(-20, 0.02, 10);
    road.receiveShadow = true;
    this.group.add(road);

    // Pedestrian path to the pump house
    const pathGeom = new THREE.PlaneGeometry(14, 3.5);
    const path = new THREE.Mesh(pathGeom, roadMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(-13, 0.03, -2);
    path.receiveShadow = true;
    this.group.add(path);
  }

  createPerimeterWalls() {
    // Low rustic stone walls around the farm
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xa89f91,
      roughness: 0.9
    });

    const createWallSegment = (x, z, length, isHorizontal) => {
      const geom = isHorizontal 
        ? new THREE.BoxGeometry(length, 0.9, 0.6)
        : new THREE.BoxGeometry(0.6, 0.9, length);
      const wall = new THREE.Mesh(geom, wallMat);
      wall.position.set(x, 0.45, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.group.add(wall);
    };

    // North wall
    createWallSegment(4, -24, 86, true);
    // East wall
    createWallSegment(47, 8, 64, false);
    // South wall (with gate gap)
    createWallSegment(18, 40, 58, true);
    // West wall
    createWallSegment(-39, 8, 64, false);
  }

  createTrees() {
    // Create decorative stylized Olive trees and Date Palms
    const treeGroup = new THREE.Group();

    // Reusable materials
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const oliveLeavesMat = new THREE.MeshStandardMaterial({ color: 0x4f772d, roughness: 0.8 });
    const palmLeavesMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.8 });

    // Helper: Olive Tree
    const addOliveTree = (x, z, scale = 1) => {
      const tGroup = new THREE.Group();
      tGroup.position.set(x, 0, z);
      tGroup.scale.setScalar(scale);

      // Trunk
      const trunkGeom = new THREE.CylinderGeometry(0.25, 0.4, 2.2, 7);
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = 1.1;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tGroup.add(trunk);

      // Foliage (low-poly clusters)
      const f1Geom = new THREE.DodecahedronGeometry(1.6);
      const f1 = new THREE.Mesh(f1Geom, oliveLeavesMat);
      f1.position.y = 2.8;
      f1.castShadow = true;
      tGroup.add(f1);

      const f2Geom = new THREE.DodecahedronGeometry(1.2);
      const f2 = new THREE.Mesh(f2Geom, oliveLeavesMat);
      f2.position.set(0.6, 3.2, 0.4);
      f2.castShadow = true;
      tGroup.add(f2);

      treeGroup.add(tGroup);
    };

    // Helper: Date Palm
    const addPalmTree = (x, z, scale = 1) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(x, 0, z);
      pGroup.scale.setScalar(scale);

      // Slender curved trunk
      const trunkGeom = new THREE.CylinderGeometry(0.2, 0.35, 4.5, 7);
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = 2.25;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      trunk.castShadow = true;
      pGroup.add(trunk);

      // Palm fronds
      for (let i = 0; i < 7; i++) {
        const frondGeom = new THREE.ConeGeometry(0.35, 2.8, 5);
        const frond = new THREE.Mesh(frondGeom, palmLeavesMat);
        frond.position.set(0, 4.5, 0);
        frond.rotation.z = Math.PI / 3;
        frond.rotation.y = (i / 7) * Math.PI * 2;
        frond.castShadow = true;
        pGroup.add(frond);
      }

      treeGroup.add(pGroup);
    };

    // Place trees around edges
    const treePositions = [
      { x: -35, z: -18, type: 'palm' },
      { x: -33, z: 25, type: 'palm' },
      { x: 38, z: -20, type: 'palm' },
      { x: 42, z: 32, type: 'palm' },
      { x: 44, z: 5, type: 'olive' },
      { x: -32, z: -5, type: 'olive' },
      { x: 2, z: -22, type: 'olive' },
      { x: 24, z: -22, type: 'olive' },
      { x: 35, z: 38, type: 'olive' }
    ];

    treePositions.forEach(p => {
      if (p.type === 'palm') addPalmTree(p.x, p.z, 0.9 + Math.random() * 0.3);
      else addOliveTree(p.x, p.z, 0.9 + Math.random() * 0.3);
    });

    this.group.add(treeGroup);
  }
}
