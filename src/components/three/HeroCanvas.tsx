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
      castShadow
      receiveShadow
      userData={{ index, originalPosition: position }}
    >
      <meshPhysicalMaterial
        color="#F2EDE0" // Warm cream
        roughness={0.5}
        metalness={0.1}
        clearcoat={0.1}
        // TODO: Swap these materials with reel stills, service glyphs, and brand marks
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
    
    const cells = groupRef.current.children;
    
    // (a) ASSEMBLY: Fly in from random positions (timer-driven intro)
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
          delay: Math.random() * 0.5 + 1.5 // Wait for preloader wipe
        }),
        gsap.to(cell.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          delay: Math.random() * 0.5 + 1.5
        })
      );
    });

    // The moment scroll takes over, kill the intro tweens and snap cells to
    // their assembled state. Otherwise the timer-driven intro and the scrubbed
    // timeline fight over the same properties and the motion glitches.
    let introKilled = false;
    const killIntro = () => {
      if (introKilled) return;
      introKilled = true;
      introTweens.forEach((t) => t.kill());
      cells.forEach((cell) => {
        const p = cell.userData.originalPosition;
        cell.position.set(p[0], p[1], p[2]);
        cell.scale.set(1, 1, 1);
      });
    };

    // (b) SHOWCASE & (c) THE CUT (ScrollTrigger)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: '+=200%', // 2 viewport heights of scrolling
        scrub: 1, // damped scrub
        pin: true,
        refreshPriority: 1, // Ensure this pin is calculated before downstream pins
        onUpdate: (self) => {
          if (self.progress > 0) killIntro();
        },
      }
    });
    
    // Refresh ScrollTrigger to update downstream elements like Process
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    // Rotate the entire lattice
    tl.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 0.5,
      ease: 'none',
      duration: 1
    }, 0);
    
    // Move lattice to right side
    tl.to(groupRef.current.position, {
      x: 3,
      ease: 'power2.inOut',
      duration: 0.5
    }, 0);

    // Disperse into a bounded drifting cloud. Targets are deterministic
    // pseudo-random per cell and stay inside the camera frame (the old
    // targets flew to x=±16, far outside the ±5 viewport, which read as
    // a glitch instead of a choreographed explosion).
    const fract = (x: number) => x - Math.floor(x);
    const cloudPos = (i: number): [number, number, number] => {
      const f1 = fract(Math.sin(i * 12.9898) * 43758.5453);
      const f2 = fract(Math.sin(i * 78.233) * 12543.123);
      return [(f1 - 0.5) * 10, (f2 - 0.5) * 6, (f1 * f2 - 0.25) * 4];
    };
    cells.forEach((cell, i) => {
      const [cx, cy, cz] = cloudPos(i);
      tl.to(cell.position, {
        x: cx, // Drift apart into a cloud
        y: cy,
        z: cz,
        ease: 'power3.inOut',
        duration: 0.5
      }, 0.5); // Starts halfway through the scroll
      
      tl.to(cell.rotation, {
        x: 0, y: 0, z: 0,
        ease: 'power2.inOut',
        duration: 0.5
      }, 0.5);
    });

  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[Math.PI / 8, Math.PI / 4, 0]}>
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
        <directionalLight position={[10, 10, 5]} intensity={2} color="#F2EDE0" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#00E5FF" />
        <Lattice />
      </Canvas>
    </div>
  );
}
