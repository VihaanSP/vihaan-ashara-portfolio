import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '../../lib/gsap';

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const count = 40;
  const radius = 1.2;
  const height = 15;
  const twist = 3;

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Connect rotation to global page scroll
    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 6, // Spin elegantly over the whole page
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      }
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.05]}>
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1);
        const y = (t - 0.5) * height;
        const angle = t * Math.PI * 2 * twist;
        
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        return (
          <group key={i} position={[0, y, 0]}>
            {/* Strand 1 (White) */}
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.2} emissive="#FFFFFF" emissiveIntensity={0.2} />
            </mesh>
            
            {/* Strand 2 (Cyan Accent) */}
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#66FCF1" metalness={0.8} roughness={0.2} emissive="#66FCF1" emissiveIntensity={0.6} />
            </mesh>
            
            {/* Connector Rung */}
            <mesh rotation={[0, -angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, radius * 2, 8]} />
              <meshStandardMaterial color="#1F2833" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export default function DNACanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#FFFFFF" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#66FCF1" />
        <DNAHelix />
      </Canvas>
    </div>
  );
}
