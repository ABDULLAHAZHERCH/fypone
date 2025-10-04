'use client';
import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';

interface SavedOutfit {
  id: string;
  name: string;
  thumbnail: string;
  itemCount: number;
  createdAt: Date;
}

interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  isNew?: boolean;
}

export default function Dashboard() {
  const [userName] = useState('Abdullah');
  
  // Sample data - in real app this would come from API
  const savedOutfits: SavedOutfit[] = [
    {
      id: '1',
      name: 'Work Meeting',
      thumbnail: '/outfit1.jpg',
      itemCount: 3,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2', 
      name: 'Weekend Casual',
      thumbnail: '/outfit2.jpg',
      itemCount: 2,
      createdAt: new Date('2025-01-14')
    },
    {
      id: '3',
      name: 'Date Night',
      thumbnail: '/outfit3.jpg', 
      itemCount: 4,
      createdAt: new Date('2025-01-13')
    }
  ];

  const newArrivals: ClothingItem[] = [
    {
      id: '1',
      name: 'Premium Cotton Tee',
      brand: 'StyleCorp',
      image: '/tee.jpg',
      isNew: true
    },
    {
      id: '2',
      name: 'Classic Denim Jacket',
      brand: 'RetroWear',
      image: '/jacket.jpg',
      isNew: true
    },
    {
      id: '3',
      name: 'Casual Chinos',
      brand: 'ComfortFit',
      image: '/chinos.jpg',
      isNew: true
    },
    {
      id: '4',
      name: 'Knit Sweater',
      brand: 'WarmWear',
      image: '/sweater.jpg',
      isNew: true
    }
  ];

  const recentlyViewed: ClothingItem[] = [
    {
      id: '5',
      name: 'Stripe Shirt',
      brand: 'PatternPro',
      image: '/stripe-shirt.jpg'
    },
    {
      id: '6',
      name: 'Black Jeans',
      brand: 'DenimCo',
      image: '/black-jeans.jpg'
    }
  ];

  return (
    <AppLayout>
      <div className="p-6 overflow-y-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-blue-100 mb-6">
                Ready to explore your style? Your digital twin is waiting to try on some amazing looks.
              </p>
              
              {/* Primary CTA */}
              <Link
                href="/fitting-room"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <span className="mr-2">🎭</span>
                Enter Fitting Room
              </Link>
            </div>

            {/* Digital Twin Preview */}
            <div className="flex justify-center">
              <div className="w-32 h-40 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <div className="text-4xl">👤</div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Outfits Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Your Saved Outfits</h2>
            <Link 
              href="/wardrobe?tab=outfits"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedOutfits.map((outfit) => (
              <Link key={outfit.id} href={`/fitting-room?outfit=${outfit.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-4xl">👔</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{outfit.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {outfit.itemCount} items
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {outfit.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Create New Outfit Card */}
            <Link href="/wardrobe">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer h-full flex flex-col items-center justify-center p-6 min-h-[200px]">
                <div className="text-4xl mb-2">➕</div>
                <p className="font-medium text-gray-600 dark:text-gray-400 text-center">
                  Create New Outfit
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">New Arrivals</h2>
            <Link 
              href="/wardrobe?filter=new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              See All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center">
                    <span className="text-4xl">👕</span>
                  </div>
                  
                  {/* New Badge */}
                  {item.isNew && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl flex items-center justify-center space-x-2">
                    <Link
                      href={`/fitting-room?item=${item.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Try On
                    </Link>
                    <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                      ♡
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recently Viewed</h2>
          
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {recentlyViewed.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-3xl">👔</span>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}