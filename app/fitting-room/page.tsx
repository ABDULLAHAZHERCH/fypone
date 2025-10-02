'use client';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

// Type definitions for the Model component props
interface ModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

// A component to load our 3D models
function Model({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(url);
  // Clone the scene so we can use it multiple times
  const clonedScene = scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      scale={scale} 
      rotation={rotation}
    />
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
}

// Clothing item interface
interface ClothingItem {
  id: string;
  name: string;
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

export default function FittingRoom() {
  const [currentClothing, setCurrentClothing] = useState<ClothingItem | null>(null);

  // Sample clothing catalog - in a real app, this would come from a database
  const clothingCatalog: ClothingItem[] = [
    {
      id: 'tshirt',
      name: 'Classic T-Shirt',
      url: '/tshirt.glb',
      position: [0, -1, 0],
      scale: 1,
    },
    // Add more clothing items here as you get them
  ];

  return (
    <div className="w-screen h-screen grid grid-cols-4 bg-background">
      {/* Sidebar UI */}
      <div className="col-span-1 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-600">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-foreground">v-FIT Virtual Closet</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Select an item to try on your digital twin.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground mb-2">Clothing Catalog</h3>
          
          {clothingCatalog.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentClothing(item)}
              className={`w-full p-3 rounded-lg shadow text-left transition-colors ${
                currentClothing?.id === item.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-foreground hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-xs opacity-70">Click to try on</div>
            </button>
          ))}
          
          <button
            onClick={() => setCurrentClothing(null)}
            className={`w-full p-3 rounded-lg shadow text-left transition-colors ${
              currentClothing === null
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-700 text-foreground hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <div className="font-medium">Remove Clothing</div>
            <div className="text-xs opacity-70">View base avatar</div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Controls</h4>
          <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
            <li>• Left click + drag to rotate</li>
            <li>• Right click + drag to pan</li>
            <li>• Scroll to zoom in/out</li>
          </ul>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="col-span-3 relative">
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 50 }}
          className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Camera controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
          />

          {/* Use Suspense to show a fallback while models are loading */}
          <Suspense fallback={<LoadingFallback />}>
            {/* The main avatar model */}
            <Model 
              url="/avatar.glb" 
              position={[0, -1, 0]} 
            />

            {/* Conditionally render the clothing model */}
            {currentClothing && (
              <Model 
                url={currentClothing.url}
                position={currentClothing.position}
                scale={currentClothing.scale}
                rotation={currentClothing.rotation}
              />
            )}
          </Suspense>
        </Canvas>
        
        {/* Overlay UI */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
          <h3 className="font-semibold text-foreground mb-1">Current Look</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentClothing ? currentClothing.name : 'Base Avatar'}
          </p>
        </div>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white rounded-lg p-3 max-w-xs">
          <p className="text-sm">
            <strong>Welcome to your Virtual Fitting Room!</strong><br />
            Select clothing from the sidebar to see how it looks on your digital twin.
          </p>
        </div>
      </div>
    </div>
  );
}

// Preload models for better performance
useGLTF.preload('/avatar.glb');
useGLTF.preload('/tshirt.glb');