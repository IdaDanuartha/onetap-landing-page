"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

function NFCRings() {
  const ringsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      // Loop progress from 0 to 1
      const progress = ((t * 0.5) + i * 0.33) % 1; 
      
      // Scale from 0.3 to 1.2 (doesn't travel too far)
      const scale = 0.3 + progress * 0.9;
      ring.scale.set(scale, scale, scale);
      
      // Opacity fades out as it expands
      const mesh = ring.children[0] as THREE.Mesh;
      if (mesh && mesh.material) {
        let opacity = 0;
        if (progress < 0.1) opacity = progress * 10;
        else opacity = 1 - ((progress - 0.1) / 0.9);
        
        // Lower max opacity for a more subtle look
        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3;
      }
    });
  });

  return (
    <group position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(el) => { ringsRef.current[i] = el; }}>
          <mesh>
            {/* Very thin torus for the signal (radius 1, tube 0.005) */}
            <torusGeometry args={[1, 0.004, 16, 64]} />
            <meshBasicMaterial color="#FF5FA2" transparent depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function KeychainModel() {
  const group = useRef<THREE.Group>(null);
  const logoTexture = useTexture("/images/logo_simple.png");

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating rotation
    group.current.rotation.y = Math.sin(t / 4) / 4;
    group.current.rotation.x = Math.cos(t / 4) / 8;
  });

  return (
    <group ref={group} dispose={null} scale={1.5} frustumCulled={false}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        
        {/* Animated NFC Signal Rings */}
        <NFCRings />

        {/* Keychain Body (Rounded Box) */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow frustumCulled={false}>
          <boxGeometry args={[1.2, 1.6, 0.15]} />
          <meshStandardMaterial 
            color="#FFF0F5" 
            roughness={0.2} 
            metalness={0.1}
          />
        </mesh>

        {/* Front Logo */}
        <mesh position={[0, -0.2, 0.076]} castShadow frustumCulled={false}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial 
            map={logoTexture}
            transparent={true}
            roughness={0.4} 
            metalness={0.1}
          />
        </mesh>

        {/* Back Logo */}
        <mesh position={[0, -0.2, -0.076]} rotation={[0, Math.PI, 0]} castShadow frustumCulled={false}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial 
            map={logoTexture}
            transparent={true}
            roughness={0.4} 
            metalness={0.1}
          />
        </mesh>

        {/* Ring connection hole */}
        <mesh position={[0, 0.7, 0]} frustumCulled={false}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Key Ring */}
        <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow frustumCulled={false}>
          <torusGeometry args={[0.3, 0.04, 16, 100]} />
          <meshStandardMaterial 
            color="#DCDCDC" 
            roughness={0.1} 
            metalness={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeDKeychain() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative cursor-grab active:cursor-grabbing">
      {/* Fallback blob behind the 3D model */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: "var(--color-primary-soft)" }}
      />
      
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#FF5FA2" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.5}
          autoRotate 
          autoRotateSpeed={0.5} 
        />
        
        <Suspense fallback={null}>
          <KeychainModel />
          <Environment preset="city" />
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
