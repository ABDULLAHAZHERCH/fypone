import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { ClothingItem } from '../lib/clothing-catalog';

interface Mini3DCanvasProps {
  item: ClothingItem;
  className?: string;
}

function ClothingModel({ url, position, scale, rotation, onLoad, onError }: {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  onLoad?: () => void;
  onError?: (error: unknown) => void;
}) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  useEffect(() => {
    if (!scene && onError) {
      onError(new Error('Failed to load 3D model'));
    }
  }, [scene, onError]);
  
  if (!scene) {
    return null;
  }
  
  return (
    <primitive 
      object={scene.clone()} 
      position={position || [0, 0, 0]}
      scale={scale || 1}
      rotation={rotation || [0, 0, 0]}
    />
  );
}

function LoadingFallback({ item }: { item: ClothingItem }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="text-6xl mb-2">
        {item.category === 'tops' && '👕'}
        {item.category === 'bottoms' && '👖'}
        {item.category === 'dresses' && '👗'}
        {item.category === 'outerwear' && '🧥'}
        {item.category === 'shoes' && '👟'}
        {item.category === 'accessories' && '👜'}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Loading 3D model...
      </div>
    </div>
  );
}

// Popup Modal Component
function Model3DPopup({ item, isOpen, onClose }: {
  item: ClothingItem;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: unknown) => {
    console.warn(`Failed to load 3D model: ${item.url}`, error);
    setIsLoading(false);
    setHasError(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.brand}</p>
        </div>
        
        {/* 3D Canvas */}
        <div className="w-full h-96 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
          {!hasError && (
            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[2, 2, 2]} intensity={0.8} />
              <directionalLight position={[-1, 1, 1]} intensity={0.4} />
              <pointLight position={[0, 2, 0]} intensity={0.3} />
              
              <OrbitControls 
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                autoRotate={false}
                minDistance={1.5}
                maxDistance={5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
              
              <Suspense fallback={null}>
                <ClothingModel 
                  url={item.url}
                  position={item.position || [0, 0, 0]}
                  scale={item.scale || 1}
                  rotation={item.rotation || [0, 0, 0]}
                  onLoad={handleLoad}
                  onError={handleError}
                />
              </Suspense>
            </Canvas>
          )}
          
          {/* Show fallback when loading or error */}
          {(isLoading || hasError) && (
            <LoadingFallback item={item} />
          )}
          
          {hasError && (
            <div className="absolute bottom-4 right-4 text-sm text-red-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
              3D model unavailable
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

export default function Mini3DCanvas({ item, className = "" }: Mini3DCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: unknown) => {
    console.warn(`Failed to load 3D model: ${item.url}`, error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleCanvasClick = () => {
    if (!hasError) {
      setShowPopup(true);
    }
  };

  return (
    <>
      <div 
        className={`relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${className}`}
        onClick={handleCanvasClick}
      >
        {!hasError && (
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 45 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 2, 2]} intensity={0.8} />
            <directionalLight position={[-1, 1, 1]} intensity={0.4} />
            <pointLight position={[0, 2, 0]} intensity={0.3} />
            
            {/* No OrbitControls - static view */}
            
            <Suspense fallback={null}>
              <ClothingModel 
                url={item.url}
                position={item.position || [0, 0, 0]}
                scale={item.scale || 1}
                rotation={item.rotation || [0, 0, 0]}
                onLoad={handleLoad}
                onError={handleError}
              />
            </Suspense>
          </Canvas>
        )}
        
        {/* Show fallback when loading or error */}
        {(isLoading || hasError) && (
          <LoadingFallback item={item} />
        )}
        
        {hasError && (
          <div className="absolute bottom-1 right-1 text-xs text-red-500 bg-white dark:bg-gray-800 px-1 rounded">
            3D model unavailable
          </div>
        )}
        
        {/* Click indicator */}
        {!hasError && !isLoading && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Click to view
          </div>
        )}
      </div>
      
      {/* Popup Modal */}
      <Model3DPopup
        item={item}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}