'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAvatar() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = () => {
    setLoading(true);
    // Simulate a 4-second AI generation process
    setTimeout(() => {
      setLoading(false);
      // On completion, redirect to the fitting room with the 'generated' model
      router.push('/fitting-room');
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Create Your Digital Twin</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Upload your photos to generate your model. For this prototype, just click Generate.
        </p>

        {/* This is just UI, no real functionality needed for the prototype */}
        <div className="space-y-4 mb-6">
          <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-foreground hover:border-blue-400 transition-colors cursor-pointer">
            📷 Front Photo
            <p className="text-sm text-gray-500 mt-1">Click to upload</p>
          </div>
          <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-foreground hover:border-blue-400 transition-colors cursor-pointer">
            📷 Side Photo
            <p className="text-sm text-gray-500 mt-1">Click to upload</p>
          </div>
          <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-foreground hover:border-blue-400 transition-colors cursor-pointer">
            📷 Back Photo
            <p className="text-sm text-gray-500 mt-1">Click to upload</p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors font-semibold"
        >
          {loading ? 'Generating Your Twin...' : 'Generate My Digital Twin'}
        </button>

        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="font-semibold text-foreground">Processing your model...</p>
            <p className="text-sm text-gray-500">Using AI to create your 3D avatar...</p>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}