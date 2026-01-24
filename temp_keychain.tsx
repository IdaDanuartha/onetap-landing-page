// 3D NFC Keychain Component - Simple & Clean
function NFCKeychain3D() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle idle animation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Main circular keychain body */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.8, 1.8, 0.2, 64]} />
                    <meshStandardMaterial
                        color="#0e53df"
                        metalness={0.8}
                        roughness={0.2}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Yellow ring at top */}
                <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <torusGeometry args={[0.3, 0.12, 16, 32]} />
                    <meshStandardMaterial
                        color="#ffd200"
                        metalness={0.95}
                        roughness={0.05}
                    />
                </mesh>

                {/* Connection between ring and body */}
                <mesh position={[0, 1.9, 0]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
                    <meshStandardMaterial
                        color="#ffd200"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* NFC Icon - Yellow circle background */}
                <mesh position={[0, 0, 0.11]} castShadow>
                    <cylinderGeometry args={[1.1, 1.1, 0.02, 32]} />
                    <meshStandardMaterial
                        color="#ffd200"
                        metalness={0.3}
                        roughness={0.4}
                    />
                </mesh>

                {/* NFC Wave Symbol - Blue */}
                <group position={[0, 0, 0.13]}>
                    {/* Wave arcs */}
                    <mesh position={[-0.2, 0, 0]}>
                        <ringGeometry args={[0.3, 0.35, 32, 1, 0, Math.PI]} />
                        <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.2, 0, 0]}>
                        <ringGeometry args={[0.5, 0.55, 32, 1, 0, Math.PI]} />
                        <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.2, 0, 0]}>
                        <ringGeometry args={[0.7, 0.75, 32, 1, 0, Math.PI]} />
                        <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
                    </mesh>
                    {/* Center dot */}
                    <mesh position={[-0.2, 0, 0]}>
                        <circleGeometry args={[0.1, 16]} />
                        <meshStandardMaterial color="#0e53df" metalness={0.5} roughness={0.3} />
                    </mesh>
                </group>

                {/* Animated NFC signal rings */}
                {[0, 0.7, 1.4].map((delay, i) => {
                    const time = useRef(0);
                    useFrame((state) => {
                        time.current = (state.clock.elapsedTime + delay) % 2;
                    });

                    return (
                        <mesh key={i} position={[0, 0, 0.5]}>
                            <ringGeometry args={[1.3 + i * 0.3, 1.35 + i * 0.3, 64]} />
                            <meshBasicMaterial
                                color="#ffd200"
                                transparent
                                opacity={0.6 - i * 0.2}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    );
                })}
            </Float>
        </group>
    );
}
