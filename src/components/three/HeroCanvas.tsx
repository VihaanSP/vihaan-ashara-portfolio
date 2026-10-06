import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const SPACING = 1.1;

// Define a single cell in the lattice
const Cell = ({ position, index }: { position: [number, number, number], index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <RoundedBox
      ref={meshRef}
      args={[1, 1, 1]} // Width, height, depth
      radius={0.05} // Radius of the rounded corners
      smoothness={4} // Number of curve segments
      position={position}
      userData={{ index, originalPosition: position }}
    >
      <meshStandardMaterial
        color="#FFFFFF"
        roughness={0.45}
        metalness={0.15}
      />
      {/* Thin ink seams are achieved via the gaps (SPACING) and ambient occlusion/shadows */}
    </RoundedBox>
  );
};

const Lattice = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate 3x3x3 grid positions
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          pos.push([x * SPACING, y * SPACING, z * SPACING]);
        }
      }
    }
    return pos;
  }, []);

  useFrame(() => {
    // We could add damped rotation here or let GSAP handle it all.
    // The prompt says "Scroll owns all motion — no auto-rotation, no mouse parallax."
  });

  useEffect(() => {
    if (!groupRef.current) return;
    const cells = groupRef.current.children as THREE.Mesh[];

    // 1. Temporarily assemble cells to their final solved state
    // so that GSAP records these as the start values for the scroll timeline.
    cells.forEach((cell) => {
      const p = cell.userData.originalPosition;
      cell.position.set(p[0], p[1], p[2]);
      cell.quaternion.set(0, 0, 0, 1);
      cell.scale.set(1, 1, 1);
    });

    // 2. Setup Dummies and Pivot for calculating Rubik's Cube turns
    const pivot = new THREE.Group();
    groupRef.current.add(pivot);

    const dummies = cells.map(cell => {
      const dummy = new THREE.Object3D();
      dummy.position.copy(cell.position);
      dummy.quaternion.copy(cell.quaternion);
      groupRef.current!.add(dummy);
      return { cell, dummy, lastQ: new THREE.Quaternion() };
    });
    groupRef.current.updateMatrixWorld(true);

    let introKilled = false;
    const killIntro = () => {
      if (introKilled) return;
      introKilled = true;
      introTweens.forEach((t) => t.kill());
      cells.forEach((cell) => {
        const p = cell.userData.originalPosition;
        cell.position.set(p[0], p[1], p[2]);
        cell.scale.set(1, 1, 1);
        cell.quaternion.set(0, 0, 0, 1);
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'hero-pin',
        trigger: '#hero-section',
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
        refreshPriority: 1,
        onUpdate: (self) => {
          if (self.progress > 0) killIntro();
        },
      }
    });

    // Refresh ScrollTrigger to update downstream elements like Process
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    const applyTurn = (filterFn: (d: THREE.Object3D) => boolean, axis: 'x'|'y'|'z', angle: number, startTime: number, duration: number) => {
      const targetDummies = dummies.filter(d => filterFn(d.dummy));
      
      pivot.position.set(0,0,0);
      pivot.rotation.set(0,0,0);
      pivot.updateMatrixWorld();
      
      targetDummies.forEach(d => pivot.attach(d.dummy));
      pivot.rotation[axis] = angle;
      pivot.updateMatrixWorld(true);
      targetDummies.forEach(d => groupRef.current!.attach(d.dummy));

      targetDummies.forEach(d => {
        tl.to(d.cell.position, {
          x: d.dummy.position.x,
          y: d.dummy.position.y,
          z: d.dummy.position.z,
          duration,
          ease: 'power2.inOut'
        }, startTime);
        
        let targetQ = d.dummy.quaternion.clone();
        if (d.lastQ.dot(targetQ) < 0) {
          targetQ.set(-targetQ.x, -targetQ.y, -targetQ.z, -targetQ.w);
        }
        tl.to(d.cell.quaternion, {
          x: targetQ.x,
          y: targetQ.y,
          z: targetQ.z,
          w: targetQ.w,
          duration,
          ease: 'power2.inOut',
          onUpdate: function() {
            d.cell.quaternion.normalize();
          }
        }, startTime);
        d.lastQ.copy(targetQ);
      });
    };

    // SHOWCASE (0 -> 2.5s)
    tl.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 0.5,
      ease: 'power2.inOut',
      duration: 2.5
    }, 0);
    tl.to(groupRef.current.position, {
      x: 3.6,
      y: 0.6,
      ease: 'power2.inOut',
      duration: 2.5
    }, 0);

    // THE PLAY
    applyTurn(d => d.position.x > 0.5, 'x', Math.PI / 2, 2.5, 1.2);
    applyTurn(d => d.position.y > 0.5, 'y', Math.PI / 2, 4.0, 1.2);
    applyTurn(d => Math.abs(d.position.z) < 0.5, 'z', -Math.PI / 2, 5.5, 1.2);
    applyTurn(d => d.position.x < -0.5, 'x', -Math.PI / 2, 7.0, 1.2);

    // THE SCRAMBLE
    applyTurn(d => d.position.y < -0.5, 'y', Math.PI, 8.2, 0.8);
    applyTurn(d => d.position.z > 0.5, 'z', -Math.PI / 2, 9.0, 0.8);
    applyTurn(d => Math.abs(d.position.x) < 0.5, 'x', Math.PI, 9.8, 0.8);

    // Clean up dummies
    dummies.forEach(d => groupRef.current!.remove(d.dummy));
    groupRef.current.remove(pivot);

    // 3. Now that timeline is built, set cells to randomized starting state for Intro
    const introTweens: gsap.core.Tween[] = [];
    cells.forEach((cell) => {
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 20 + 10;
      const startZ = (Math.random() - 0.5) * 20;

      const origPos = cell.userData.originalPosition;
      cell.position.set(startX, startY, startZ);
      cell.scale.set(0, 0, 0);

      introTweens.push(
        gsap.to(cell.position, {
          x: origPos[0],
          y: origPos[1],
          z: origPos[2],
          duration: 2,
          ease: 'expo.out',
          delay: Math.random() * 0.5 + 1.5
        }),
        gsap.to(cell.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          delay: Math.random() * 0.5 + 1.5
        })
      );
    });
  }, []);

  return (
    <group ref={groupRef} position={[3, 0, 0]} rotation={[Math.PI / 8, Math.PI / 4, 0]}>
      {positions.map((pos, i) => (
        <Cell key={i} index={i} position={pos} />
      ))}
    </group>
  );
};

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#FFFFFF" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#66FCF1" />
        <Lattice />
      </Canvas>
    </div>
  );
}
