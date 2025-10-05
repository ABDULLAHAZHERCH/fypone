'use client';
import { Suspense, useState, useEffect, useRef, Component } from 'react';
import { useSearchParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import AppLayout from '../../components/AppLayout';
import { ClothingItem, getClothingCatalog } from '../../lib/clothing-catalog';

// Error boundary for Canvas
class CanvasErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Canvas Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-lg text-gray-600 dark:text-gray-400">3D Viewer Error</div>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Model component interfaces

interface ModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  enablePhysics?: boolean;
  physicsProps?: {
    mass: number;
    elasticity: number;
    friction: number;
    dampening: number;
  };
  avatarRef?: React.RefObject<THREE.Group | null>;
}

// Physics-enabled cloth simulation component
function ClothModel({ 
  url, 
  position = [0, 0, 0], 
  scale = 1, 
  rotation = [0, 0, 0], 
  enablePhysics = true,
  physicsProps = { mass: 0.1, elasticity: 0.8, friction: 0.6, dampening: 0.9 },
  avatarRef
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const clothRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  const { world } = useRapier();
  
  // Cloth physics state
  const constraintsRef = useRef<unknown[]>([]);
  
  // Simplified physics setup - just render the model with basic physics wrapper
  useEffect(() => {
    if (!enablePhysics || !world) return;
    
    console.log('Physics enabled for cloth model');
    
    return () => {
      // Cleanup physics bodies
      constraintsRef.current = [];
    };
  }, [enablePhysics, world]);
  
  return (
    <group ref={groupRef}>
      {enablePhysics ? (
        <RigidBody
          type="dynamic"
          mass={physicsProps.mass}
          restitution={physicsProps.elasticity}
          friction={physicsProps.friction}
          linearDamping={physicsProps.dampening}
          angularDamping={physicsProps.dampening}
        >
          <primitive 
            ref={clothRef}
            object={clonedScene} 
            position={position} 
            scale={scale} 
            rotation={rotation}
          />
        </RigidBody>
      ) : (
        <primitive 
          object={clonedScene} 
          position={position} 
          scale={scale} 
          rotation={rotation}
        />
      )}
    </group>
  );
}

// Simple Model component (for avatar and basic rendering)
function Model({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  
  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        position={position} 
        scale={scale} 
        rotation={rotation}
      />
    </group>
  );
}

// Fit Analysis Heatmap Component
function FitAnalysisOverlay({ item, isVisible }: { item: ClothingItem | null; isVisible: boolean }) {
  if (!isVisible || !item?.fitData) return null;
  
  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'perfect': return 'bg-green-500';
      case 'snug': return 'bg-yellow-500';
      case 'tight': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs z-10">
      <h4 className="font-semibold mb-3 text-foreground">Fit Analysis</h4>
      <div className="space-y-2">
        {item.fitData.chest && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getFitColor(item.fitData.chest)}`}></div>
            <span className="text-sm">Chest: {item.fitData.chest}</span>
          </div>
        )}
        {item.fitData.waist && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getFitColor(item.fitData.waist)}`}></div>
            <span className="text-sm">Waist: {item.fitData.waist}</span>
          </div>
        )}
        {item.fitData.hips && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getFitColor(item.fitData.hips)}`}></div>
            <span className="text-sm">Hips: {item.fitData.hips}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InteractiveStyleStudio() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">👕</div>
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading fitting room...</div>
          </div>
        </div>
      </AppLayout>
    }>
      <FittingRoomContent />
    </Suspense>
  );
}

function FittingRoomContent() {
  const searchParams = useSearchParams();
  const [stagingItems, setStagingItems] = useState<ClothingItem[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<ClothingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showFitAnalysis, setShowFitAnalysis] = useState(false);
  const [physicsEnabled, setPhysicsEnabled] = useState(false); // Temporarily disabled
  const [showClothingBrowser, setShowClothingBrowser] = useState(false);
  const [clothingCatalog, setClothingCatalog] = useState<ClothingItem[]>([]);
  const avatarRef = useRef<THREE.Group>(null);
  
  // Simple movement controls
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([0, -2, 0]); // Start from bottom
  const [avatarRotation, setAvatarRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Load clothing catalog
  useEffect(() => {
    const loadData = async () => {
      const catalog = getClothingCatalog();
      setClothingCatalog(catalog);
    };
    
    loadData();
  }, []);

  // Movement controls
  const moveAvatar = (direction: 'left' | 'right' | 'forward' | 'back') => {
    const step = 0.2;
    setAvatarPosition(prev => {
      const [x, y, z] = prev;
      switch (direction) {
        case 'left': return [x - step, y, z];
        case 'right': return [x + step, y, z];
        case 'forward': return [x, y, z + step];
        case 'back': return [x, y, z - step];
        default: return prev;
      }
    });
  };
  
  const rotateAvatar = (direction: 'left' | 'right') => {
    const step = Math.PI / 8; // 22.5 degrees
    setAvatarRotation(prev => {
      const [x, y, z] = prev;
      return direction === 'left' 
        ? [x, y - step, z] 
        : [x, y + step, z];
    });
  };
  
  const resetAvatarPosition = () => {
    setAvatarPosition([0, -2, 0]); // Reset to bottom
    setAvatarRotation([0, 0, 0]);
  };

  // Initialize from URL params
  useEffect(() => {
    const itemId = searchParams.get('item');
    const outfitId = searchParams.get('outfit');
    
    if (itemId) {
      const item = clothingCatalog.find(i => i.id === itemId);
      if (item) {
        setStagingItems([item]);
      }
    }
    
    if (outfitId) {
      // Load saved outfit (would come from API in real app)
      // For demo, load some items
      setStagingItems([clothingCatalog[0], clothingCatalog[1]]);
    }
  }, [searchParams, clothingCatalog]);

  const addToAvatar = (item: ClothingItem) => {
    // Remove any existing item of the same category
    const filteredOutfit = currentOutfit.filter(existing => existing.category !== item.category);
    setCurrentOutfit([...filteredOutfit, item]);
    setSelectedItem(item);
    
    // Remove from staging
    setStagingItems(prev => prev.filter(staged => staged.id !== item.id));
  };

  const removeFromAvatar = (itemId: string) => {
    const item = currentOutfit.find(i => i.id === itemId);
    if (item) {
      setCurrentOutfit(prev => prev.filter(item => item.id !== itemId));
      setStagingItems(prev => [...prev, item]);
      
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    }
  };

  const clearAll = () => {
    setStagingItems([...stagingItems, ...currentOutfit]);
    setCurrentOutfit([]);
    setSelectedItem(null);
  };

  const getRecommendations = (item: ClothingItem) => {
    return clothingCatalog.filter(catalogItem => 
      catalogItem.id !== item.id && 
      catalogItem.category !== item.category &&
      !currentOutfit.some(worn => worn.id === catalogItem.id) &&
      !stagingItems.some(staged => staged.id === catalogItem.id)
    ).slice(0, 3);
  };

  const saveOutfit = () => {
    if (currentOutfit.length === 0) return;
    
    // In real app, would save to backend
    console.log('Saving outfit:', currentOutfit);
    alert('Outfit saved successfully!');
  };

  const shareOutfit = () => {
    // In real app, would generate image/video
    console.log('Sharing outfit:', currentOutfit);
    alert('Share functionality would generate an image/video of your look!');
  };

  const buyOutfit = () => {
    console.log('Saving outfit:', currentOutfit);
    alert('Outfit saved to your wardrobe!');
  };

  return (
    <AppLayout>
      <div className="h-full flex bg-gray-50 dark:bg-gray-900">
        {/* LEFT PANEL - Staging Area */}
        <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-foreground text-center">Queue</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {stagingItems.map((item) => (
              <div
                key={item.id}
                className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-xl border-2 border-transparent hover:border-blue-500"
                onClick={() => addToAvatar(item)}
                title={`Try on ${item.name}`}
              >
                {item.category === 'tops' && '👕'}
                {item.category === 'bottoms' && '👖'}
                {item.category === 'dresses' && '👗'}
                {item.category === 'outerwear' && '🧥'}
                {item.category === 'shoes' && '👟'}
                {item.category === 'accessories' && '👜'}
              </div>
            ))}
            
            {stagingItems.length === 0 && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                <p>Empty queue</p>
                <button
                  onClick={() => setShowClothingBrowser(true)}
                  className="mt-2 text-blue-500 hover:text-blue-600 underline"
                >
                  Browse clothes
                </button>
              </div>
            )}
          </div>
          
          {stagingItems.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <button
                onClick={() => setShowClothingBrowser(true)}
                className="w-full text-xs bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition-colors"
                title="Add More Clothes"
              >
                + Add
              </button>
              <button
                onClick={clearAll}
                className="w-full text-xs bg-red-500 text-white py-1 rounded hover:bg-red-600 transition-colors"
                title="Clear All"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* CENTER PANEL - The Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <CanvasErrorBoundary>
            <Canvas 
              key="fitting-room-canvas"
              camera={{ position: [0, 0, 3], fov: 50 }}
              className="w-full h-full"
              onError={(error) => {
                console.error('Canvas Error:', error);
              }}
            >
            {/* Studio Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.6} />
            <pointLight position={[0, 5, 0]} intensity={0.5} />
            
            {/* Environment */}
            <Environment preset="studio" />
            
            {/* Camera Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1.5}
              maxDistance={8}
              maxPolarAngle={Math.PI / 1.8}
            />

            <Physics gravity={[0, -9.81, 0]} debug={false}>
              <Suspense fallback={null}>
                {/* Avatar */}
                <group ref={avatarRef}>
                  <Model 
                    url="/avatar.glb" 
                    position={avatarPosition}
                    rotation={avatarRotation}
                  />
                </group>

                {/* Current Outfit with Physics */}
                {currentOutfit.map((item) => (
                  <ClothModel 
                    key={item.id}
                    url={item.url}
                    position={[
                      avatarPosition[0] + (item.position?.[0] || 0),
                      avatarPosition[1] + (item.position?.[1] || 0),
                      avatarPosition[2] + (item.position?.[2] || 0)
                    ]}
                    scale={item.scale || 1}
                    rotation={[
                      avatarRotation[0] + (item.rotation?.[0] || 0),
                      avatarRotation[1] + (item.rotation?.[1] || 0),
                      avatarRotation[2] + (item.rotation?.[2] || 0)
                    ]}
                    enablePhysics={physicsEnabled}
                    physicsProps={item.physics}
                    avatarRef={avatarRef}
                  />
                ))}

                {/* Invisible floor for physics */}
                <RigidBody type="fixed" position={[0, -2, 0]}>
                  <CuboidCollider args={[10, 0.1, 10]} />
                </RigidBody>
              </Suspense>
            </Physics>
          </Canvas>
          </CanvasErrorBoundary>

          {/* Fit Analysis Overlay */}
          <FitAnalysisOverlay item={selectedItem} isVisible={showFitAnalysis} />

          {/* Current Outfit Display */}
          {currentOutfit.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs">
              <h4 className="font-semibold mb-2 text-foreground">Current Outfit</h4>
              <div className="space-y-1">
                {currentOutfit.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="truncate">{item.name}</span>
                    <button
                      onClick={() => removeFromAvatar(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2 font-bold"
                      title="Remove from avatar"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-semibold text-blue-600">
                  {currentOutfit.length} items in outfit
                </p>
              </div>
            </div>
          )}

          {/* Physics Toggle - Top Right */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
            <button
              onClick={() => setPhysicsEnabled(!physicsEnabled)}
              className={`p-2 rounded text-lg transition-colors ${
                physicsEnabled
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={`Physics ${physicsEnabled ? 'ON' : 'OFF'} - Toggle realistic cloth simulation`}
            >
              {physicsEnabled ? '🧪' : '⚙️'}
            </button>
          </div>

          {/* Movement Controls - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
            <div className="flex items-center gap-1">
              {/* Move Left */}
              <button
                onClick={() => moveAvatar('left')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
                title="Move Left"
              >
                ⬅️
              </button>
              
              {/* Move Forward */}
              <button
                onClick={() => moveAvatar('forward')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
                title="Move Forward"
              >
                ⬆️
              </button>
              
              {/* Reset Position */}
              <button
                onClick={resetAvatarPosition}
                className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xl"
                title="Reset Position"
              >
                🏠
              </button>
              
              {/* Move Backward */}
              <button
                onClick={() => moveAvatar('back')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
                title="Move Backward"
              >
                ⬇️
              </button>
              
              {/* Move Right */}
              <button
                onClick={() => moveAvatar('right')}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
                title="Move Right"
              >
                ➡️
              </button>
              
              {/* Rotate Left */}
              <button
                onClick={() => rotateAvatar('left')}
                className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors text-xl"
                title="Rotate Left"
              >
                ↪️
              </button>
              
              {/* Rotate Right */}
              <button
                onClick={() => rotateAvatar('right')}
                className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors text-xl"
                title="Rotate Right"
              >
                ↩️
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - The Inspector */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-foreground">Style Inspector</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedItem ? (
              <div className="space-y-6">
                {/* Item Details */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{selectedItem.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{selectedItem.brand}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{selectedItem.color}</span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{selectedItem.fabric}</span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs capitalize">{selectedItem.category}</span>
                  </div>
                </div>

                {/* Physics Properties */}
                {selectedItem.physics && physicsEnabled && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">🧪 Physics Properties</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Mass</div>
                        <div className="text-sm font-medium">{selectedItem.physics.mass}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Elasticity</div>
                        <div className="text-sm font-medium">{selectedItem.physics.elasticity}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Friction</div>
                        <div className="text-sm font-medium">{selectedItem.physics.friction}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Dampening</div>
                        <div className="text-sm font-medium">{selectedItem.physics.dampening}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      These values control how the fabric behaves and drapes on your avatar
                    </div>
                  </div>
                )}

                {/* Fit Analysis */}
                <div>
                  <button
                    onClick={() => setShowFitAnalysis(!showFitAnalysis)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      showFitAnalysis 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {showFitAnalysis ? 'Hide' : 'Show'} Fit Analysis
                  </button>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Pairs well with</h4>
                  <div className="space-y-2">
                    {getRecommendations(selectedItem).map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-gray-50 dark:bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setStagingItems(prev => [...prev, rec])}
                      >
                        <p className="font-medium text-sm text-foreground">{rec.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{rec.brand}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Wardrobe
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2">👕</div>
                <p>Click on an item you&apos;re wearing to see details and styling options</p>
              </div>
            )}

            {/* Outfit Actions */}
            {currentOutfit.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Complete Look</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentOutfit.length} item{currentOutfit.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={saveOutfit}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-foreground py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    💾 Save Outfit
                  </button>
                  
                  <button
                    onClick={shareOutfit}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-foreground py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    📤 Share Look
                  </button>
                  
                  <button
                    onClick={buyOutfit}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    � Save to Wardrobe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clothing Browser Modal */}
      {showClothingBrowser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Browse Clothing</h2>
              <button
                onClick={() => setShowClothingBrowser(false)}
                className="text-gray-500 hove   r:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              > 
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clothingCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => {
                      setStagingItems(prev => [...prev, item]);
                      setShowClothingBrowser(false);
                    }}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-4xl mb-2">
                      {item.category === 'tops' && '👕'}
                      {item.category === 'bottoms' && '👖'}
                      {item.category === 'dresses' && '👗'}
                      {item.category === 'outerwear' && '🧥'}
                      {item.category === 'shoes' && '👟'}
                      {item.category === 'accessories' && '👜'}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{item.color}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// // Preload common models
// useGLTF.preload('/tshirt.glb');
// useGLTF.preload('/jacket.glb');