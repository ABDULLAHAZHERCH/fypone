import { Suspense, useState } from 'react';
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
  onError?: () => void;
}) {
  try {
    const { scene } = useGLTF(url);
    
    // Call onLoad when model loads successfully
    if (onLoad) onLoad();
    
    return (
      <primitive 
        object={scene.clone()} 
        position={position || [0, 0, 0]}
        scale={scale || 1}
        rotation={rotation || [0, 0, 0]}
      />
    );
  } catch (error) {
    // Call onError when model fails to load
    if (onError) onError();
    return null;
  }
}

function LoadingFallback({ item }: { item: ClothingItem }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="text-4xl">
        {item.category === 'tops' && '👕'}
        {item.category === 'bottoms' && '👖'}
        {item.category === 'dresses' && '👗'}
        {item.category === 'outerwear' && '🧥'}
        {item.category === 'shoes' && '👟'}
        {item.category === 'accessories' && '👜'}
      </div>
    </div>
  );
}

export default function Mini3DCanvas({ item, className = "" }: Mini3DCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        className="w-full h-full"
        onCreated={() => setIsLoading(true)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <directionalLight position={[-1, 1, 1]} intensity={0.4} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={1}
          maxDistance={3}
        />
        
        <Suspense fallback={null}>
          <ClothingModel 
            url={item.url}
            position={item.position}
            scale={item.scale}
            rotation={item.rotation}
            onLoad={handleLoad}
            onError={handleError}
          />
        </Suspense>
      </Canvas>
      
      {/* Show fallback only when loading or error */}
      {(isLoading || hasError) && <LoadingFallback item={item} />}
    </div>
  );
}