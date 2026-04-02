'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';

// ── Hotspot data (matching glint style) ──
const hotspots = [
    { lat: 31.04, lon: 34.85, label: 'ISRAEL COMMAND', type: 'critical', size: 1.5 },
    { lat: 35.68, lon: 51.38, label: 'TEHRAN', type: 'critical', size: 1.5 },
    { lat: 48.37, lon: 31.16, label: 'UKRAINE ZA', type: 'critical', size: 1.2 },
    { lat: 25.20, lon: 55.27, label: 'UAE DEFENSE', type: 'high', size: 1.0 },
    { lat: 40.71, lon: -74.01, label: 'NYSE', type: 'market', size: 0.8 },
    { lat: 51.51, lon: -0.13, label: 'LSE', type: 'market', size: 0.8 },
    { lat: 19.08, lon: 72.88, label: 'NSE', type: 'market', size: 0.8 },
    { lat: 25.03, lon: 121.56, label: 'TAIPEI', type: 'high', size: 1.0 },
];

// Helper to get color based on type
function getHotspotColor(type: string) {
    switch (type) {
        case 'critical': return '#ff3300'; // Bright red/orange
        case 'high': return '#ff9900'; // Orange
        case 'market': return '#00f0ff'; // Cyan
        default: return '#ffffff';
    }
}

// ── The ThreeGlobe Instance Wrapper ──
function GlintGlobe() {
    const globeRef = useRef<THREE.Group>(null);
    const [globeObj, setGlobeObj] = useState<ThreeGlobe | null>(null);

    // Initialize and configure the ThreeGlobe
    useEffect(() => {
        const globe = new ThreeGlobe()
            .showGlobe(true)
            .globeMaterial(new THREE.MeshPhongMaterial({
                color: '#050505', // Almost black ocean
                emissive: '#000000',
                transparent: true,
                opacity: 0.9,
            }))
            .showAtmosphere(true)
            .atmosphereColor('#112244')
            .atmosphereAltitude(0.15);

        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(countries => {
                globe
                    .polygonsData(countries.features)
                    .polygonAltitude(0.02)
                    .polygonCapColor(() => '#4a4a5a') // Much brighter slate for visibility against dark scene
                    .polygonSideColor(() => '#111116')
                    .polygonStrokeColor(() => '#8a8a9a') // Bright borders
                    .polygonsTransitionDuration(300);

                // Highlight specific countries (e.g., Israel, Iran, Ukraine, Russia)
                setTimeout(() => {
                    globe.polygonCapColor((feat: any) => {
                        const admin = feat.properties.ADMIN || feat.properties.NAME;
                        if (['Israel', 'Iran', 'Ukraine', 'Russia', 'Taiwan'].includes(admin)) {
                            return 'rgba(255, 120, 0, 0.6)'; // Brighter orange highlight
                        }
                        return '#4a4a5a';
                    });
                }, 1000);
            });

        // Add rings for hotspots
        const ringData = hotspots.map(h => ({
            lat: h.lat,
            lng: h.lon,
            color: getHotspotColor(h.type),
            maxR: h.size * 3,
            propagationSpeed: 1.5,
            repeatPeriod: 1000
        }));

        globe
            .ringsData(ringData)
            .ringColor('color')
            .ringMaxRadius('maxR')
            .ringPropagationSpeed('propagationSpeed')
            .ringRepeatPeriod('repeatPeriod')
            .ringAltitude(0.02);

        // Add custom HTML markers for labels
        const htmlData = hotspots.map(h => ({
            lat: h.lat,
            lng: h.lon,
            label: h.label,
            color: getHotspotColor(h.type)
        }));

        globe
            .htmlElementsData(htmlData)
            .htmlElement((d: any) => {
                const el = document.createElement('div');
                el.innerHTML = `
          <div style="
            color: ${d.color};
            font-size: 8px;
            font-family: monospace;
            font-weight: bold;
            background: rgba(0,0,0,0.8);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 2px 4px;
            border-radius: 4px;
            pointer-events: none;
            backdrop-filter: blur(2px);
            white-space: nowrap;
          ">${d.label}</div>
        `;
                return el;
            })
            .htmlAltitude(0.05);

        setGlobeObj(globe);
    }, []);

    // Update HTML elements positioning on every frame
    useFrame(() => {
        if (globeRef.current) {
            // Apply slow auto-rotation
            globeRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={globeRef}>
            {globeObj && <primitive object={globeObj} />}
        </group>
    );
}

export default function Globe3D() {
    return (
        <div className="h-full w-full bg-[#03060c]">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 rounded-full border border-red-500/20 bg-red-950/40 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">
                    Global Tension <span className="text-white text-xs ml-1">100</span> <span className="text-red-500 ml-1">SEVERE</span>
                </span>
            </div>

            <Canvas camera={{ position: [0, 0, 250], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 0, 250]} intensity={1.5} color="#ffffff" />

                <Stars radius={300} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

                <React.Suspense fallback={null}>
                    <GlintGlobe />
                </React.Suspense>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={120}
                    maxDistance={400}
                    autoRotate={false}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>
        </div>
    );
}
