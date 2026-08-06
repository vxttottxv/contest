import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Sparkles, Building2, Eye } from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface Campus3DViewerProps {
  buildings: Building3D[];
  selectedBuilding: Building3D;
  onSelectBuilding: (building: Building3D) => void;
}

export default function Campus3DViewer({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: Campus3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18181b); // Dark slate background matching reference photo
    scene.fog = new THREE.FogExp2(0x18181b, 0.008);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(30, 22, 35);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevents camera from going under ground
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.8;
    controls.target.set(0, 4, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(40, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.8);
    scene.add(hemiLight);

    // 6. Campus Materials
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    const yardMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 }); // Sand playground
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }); // Green grass track border
    const wallBrickMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 }); // Red brick front wall
    const wallWhiteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 }); // Building main body
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.5 }); // Windows
    const silverDomeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.8 }); // Gym silver dome
    const roofBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });

    // 7. Base Terrain & Playground Construction
    const baseGround = new THREE.Mesh(new THREE.BoxGeometry(70, 1, 60), groundMat);
    baseGround.position.set(0, -0.5, 0);
    baseGround.receiveShadow = true;
    scene.add(baseGround);

    // Front Playground / Yard (Matching Photo)
    const playground = new THREE.Mesh(new THREE.BoxGeometry(28, 0.2, 18), yardMat);
    playground.position.set(6, 0.1, 12);
    playground.receiveShadow = true;
    scene.add(playground);

    const trackBorder = new THREE.Mesh(new THREE.BoxGeometry(30, 0.15, 20), trackMat);
    trackBorder.position.set(6, 0.05, 12);
    trackBorder.receiveShadow = true;
    scene.add(trackBorder);

    // Front Entrance Brick Wall (Matching Photo)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(32, 2.5, 1), wallBrickMat);
    frontWall.position.set(6, 1.25, 23);
    frontWall.castShadow = true;
    scene.add(frontWall);

    // 8. Procedural 3D Buildings (Matched with Photo Layout & 4 Main Categories)
    const buildingMeshes: { mesh: THREE.Group; buildingData: Building3D }[] = [];

    // Helper to build window grids on a building block
    const addWindowGrid = (parent: THREE.Group, width: number, height: number, depth: number) => {
      const windowGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
      for (let y = 1.5; y < height - 1; y += 1.8) {
        for (let x = -width / 2 + 1.2; x < width / 2 - 1; x += 1.8) {
          const winFront = new THREE.Mesh(windowGeo, glassMat);
          winFront.position.set(x, y, depth / 2 + 0.06);
          parent.add(winFront);

          const winBack = new THREE.Mesh(windowGeo, glassMat);
          winBack.position.set(x, y, -depth / 2 - 0.06);
          parent.add(winBack);
        }
      }
    };

    // --- A동: 본관 / 본부동 (Main Administration Building) ---
    const aData = buildings.find((b) => b.id === 'bld-1') || buildings[0];
    const groupA = new THREE.Group();
    groupA.position.set(-12, 0, -5);

    const bodyA = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 8), wallWhiteMat);
    bodyA.position.set(0, 5, 0);
    bodyA.castShadow = true;
    bodyA.receiveShadow = true;
    groupA.add(bodyA);

    const roofA = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.6, 8.4), roofBlueMat);
    roofA.position.set(0, 10.3, 0);
    groupA.add(roofA);
    addWindowGrid(groupA, 14, 10, 8);

    scene.add(groupA);
    buildingMeshes.push({ mesh: groupA, buildingData: aData });

    // --- B동: 공학관 / IT융합관 (Engineering Building) ---
    const bData = buildings.find((b) => b.id === 'bld-2') || buildings[1];
    const groupB = new THREE.Group();
    groupB.position.set(-14, 0, 10);

    const bodyB = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 10), wallWhiteMat);
    bodyB.position.set(0, 6, 0);
    bodyB.castShadow = true;
    bodyB.receiveShadow = true;
    groupB.add(bodyB);

    const roofB = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.8, 10.4), roofBlueMat);
    roofB.position.set(0, 12.4, 0);
    groupB.add(roofB);
    addWindowGrid(groupB, 12, 12, 10);

    scene.add(groupB);
    buildingMeshes.push({ mesh: groupB, buildingData: bData });

    // --- C동: 중앙도서관 & Silver Curved Gym Dome (Matching Photo!) ---
    const cData = buildings.find((b) => b.id === 'bld-3') || buildings[2];
    const groupC = new THREE.Group();
    groupC.position.set(10, 0, -6);

    // Library Block
    const bodyC = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 9), wallWhiteMat);
    bodyC.position.set(0, 4, 0);
    bodyC.castShadow = true;
    bodyC.receiveShadow = true;
    groupC.add(bodyC);
    addWindowGrid(groupC, 12, 8, 9);

    // Iconic Silver Curved Metallic Gym Dome (Matching Reference Photo!)
    const domeGeo = new THREE.CylinderGeometry(4.5, 4.5, 10, 32, 1, false, 0, Math.PI);
    const domeMesh = new THREE.Mesh(domeGeo, silverDomeMat);
    domeMesh.rotation.z = Math.PI / 2;
    domeMesh.rotation.y = Math.PI / 2;
    domeMesh.position.set(0, 8.5, 2);
    domeMesh.castShadow = true;
    groupC.add(domeMesh);

    scene.add(groupC);
    buildingMeshes.push({ mesh: groupC, buildingData: cData });

    // --- D동: 명지 국제 기숙사 (Global Dormitory Tower) ---
    const dData = buildings.find((b) => b.id === 'bld-4') || buildings[3];
    const groupD = new THREE.Group();
    groupD.position.set(-2, 0, -18);

    const bodyD = new THREE.Mesh(new THREE.BoxGeometry(14, 16, 8), wallWhiteMat);
    bodyD.position.set(0, 8, 0);
    bodyD.castShadow = true;
    bodyD.receiveShadow = true;
    groupD.add(bodyD);

    const roofD = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.8, 8.4), roofBlueMat);
    roofD.position.set(0, 16.4, 0);
    groupD.add(roofD);
    addWindowGrid(groupD, 14, 16, 8);

    scene.add(groupD);
    buildingMeshes.push({ mesh: groupD, buildingData: dData });

    // 9. Trees Line (Matching Photo along front wall and playground border)
    const addTree = (x: number, z: number) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2), treeTrunkMat);
      trunk.position.set(x, 1, z);
      trunk.castShadow = true;
      scene.add(trunk);

      const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), treeLeavesMat);
      leaves.position.set(x, 2.5, z);
      leaves.castShadow = true;
      scene.add(leaves);
    };

    for (let x = -8; x <= 20; x += 4) {
      addTree(x, 21.5);
    }
    for (let z = 3; z <= 20; z += 4.5) {
      addTree(20.5, z);
    }

    // 10. Raycasting for Mouse Hover & Building Click Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      for (const item of buildingMeshes) {
        const intersects = raycaster.intersectObjects(item.mesh.children, true);
        if (intersects.length > 0) {
          onSelectBuilding(item.buildingData);
          break;
        }
      }
    };

    const handleCanvasMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      let found = false;

      for (const item of buildingMeshes) {
        const intersects = raycaster.intersectObjects(item.mesh.children, true);
        if (intersects.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          found = true;
          break;
        }
      }

      if (!found) {
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);
    renderer.domElement.addEventListener('mousemove', handleCanvasMouseMove);

    // 11. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('mousemove', handleCanvasMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update autoRotate when state changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(30, 22, 35);
      controlsRef.current.target.set(0, 4, 0);
      controlsRef.current.update();
      setAutoRotate(true);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950 select-none">
      {/* Top 3D Control Bar */}
      <div className="p-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-white/10 text-xs font-bold backdrop-blur-md">
          <Sparkles size={16} className="text-blue-400" />
          <span>명지전문대학 360° Three.js 3D WebGL 실물 캠퍼스 렌더러</span>
        </div>

        {/* Camera Tools */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              autoRotate ? 'text-blue-400 bg-blue-500/20' : 'text-neutral-400 hover:text-white'
            }`}
            title="360도 자동 회전 (Auto-rotate)"
          >
            <RotateCw size={16} className={autoRotate ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              if (cameraRef.current) cameraRef.current.position.multiplyScalar(0.85);
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="확대 (Zoom In)"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => {
              if (cameraRef.current) cameraRef.current.position.multiplyScalar(1.15);
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="축소 (Zoom Out)"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetCamera}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="카메라 리셋"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* WebGL 3D Canvas Container */}
      <div ref={mountRef} className="w-full flex-1 relative z-10" />

      {/* Building Hotspots Quick Selector & Info Bar */}
      <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs bg-neutral-950/90 border-t border-white/10 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-blue-400" />
          <span>
            마우스를 드래그하면 <strong>360도 자유 회전</strong>되며, 3D 건물을 직접 클릭하면 세부 정보가 동기화됩니다.
          </span>
        </div>

        {/* Building Selector Badges */}
        <div className="flex gap-2 overflow-x-auto max-w-full">
          {buildings.map((bld) => {
            const isSelected = selectedBuilding.id === bld.id;
            return (
              <button
                key={bld.id}
                onClick={() => onSelectBuilding(bld)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Building2 size={14} />
                <span>{bld.code}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
