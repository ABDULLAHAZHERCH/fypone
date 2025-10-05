'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';
import Mini3DCanvas from '../../components/Mini3DCanvas';
import { ClothingItem, SavedOutfit, getClothingCatalog, getSavedOutfits } from '../../lib/clothing-catalog';

export default function Wardrobe() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">👔</div>
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading wardrobe...</div>
          </div>
        </div>
      </AppLayout>
    }>
      <WardrobeContent />
    </Suspense>
  );
}

function WardrobeContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'items' | 'outfits' | 'wishlist'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  // Load dynamic catalog
  useEffect(() => {
    const catalog = getClothingCatalog();
    const outfits = getSavedOutfits();
    setClothingItems(catalog);
    setSavedOutfits(outfits);
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    const filter = searchParams.get('filter');
    
    if (tab === 'outfits') setActiveTab('outfits');
    if (filter === 'new') {
      setActiveCategory('all');
      // Would filter for new items
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'All Items', count: clothingItems.length },
    { id: 'tops', name: 'Tops', count: clothingItems.filter(i => i.category === 'tops').length },
    { id: 'bottoms', name: 'Bottoms', count: clothingItems.filter(i => i.category === 'bottoms').length },
    { id: 'dresses', name: 'Dresses', count: clothingItems.filter(i => i.category === 'dresses').length },
    { id: 'outerwear', name: 'Outerwear', count: clothingItems.filter(i => i.category === 'outerwear').length },
    { id: 'shoes', name: 'Shoes', count: clothingItems.filter(i => i.category === 'shoes').length },
    { id: 'accessories', name: 'Accessories', count: clothingItems.filter(i => i.category === 'accessories').length }
  ];

  const brands = [...new Set(clothingItems.map(item => item.brand))];
  const colors = [...new Set(clothingItems.map(item => item.color))];

  const filteredItems = clothingItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(item.color);
    const matchesTab = activeTab === 'items' || 
                      (activeTab === 'wishlist' && item.isWishlisted);

    return matchesCategory && matchesSearch && matchesBrand && matchesColor && matchesTab;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <AppLayout>
      <div className="h-full flex">
        {/* Left Panel - Filters & Folders */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-foreground mb-4">Wardrobe</h2>
            
            {/* Tabs */}
            <div className="flex space-x-1 mb-4">
              {[
                { id: 'items', label: 'Items', count: clothingItems.length },
                { id: 'outfits', label: 'Outfits', count: savedOutfits.length },
                { id: 'wishlist', label: 'Wishlist', count: clothingItems.filter(i => i.isWishlisted).length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'items' | 'outfits' | 'wishlist')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'items' && (
              <>
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="float-right">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="mr-2 rounded"
                        />
                        <span className="text-gray-600 dark:text-gray-400">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          selectedColors.includes(color)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}

            {activeTab === 'outfits' && (
              <div className="space-y-3">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-1">{outfit.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {outfit.items.length} items
                    </p>
                    <p className="text-xs text-gray-500">
                      {outfit.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {activeTab === 'items' && `${filteredItems.length} Items`}
                  {activeTab === 'outfits' && `${savedOutfits.length} Saved Outfits`}
                  {activeTab === 'wishlist' && `${clothingItems.filter(i => i.isWishlisted).length} Wishlist Items`}
                </h3>
                {activeCategory !== 'all' && activeTab === 'items' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </p>
                )}
              </div>
              
              <Link
                href="/fitting-room"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Fitting Room
              </Link>
            </div>
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'items' || activeTab === 'wishlist' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-35 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl overflow-hidden">
                        <Mini3DCanvas item={item} className="w-full h-full" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {item.isNew && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            NEW
                          </span>
                        )}
                        {item.isWishlisted && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            ♡
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.brand}</p>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex space-x-1 text-xs">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.color}</span>
                          {item.size && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.size}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Try On Button */}
                      <Link
                        href={`/fitting-room?item=${item.id}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🎭 Try On
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Outfits View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOutfits.map((outfit) => (
                  <Link key={outfit.id} href={`/fitting-room?outfit=${outfit.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-xl flex items-center justify-center">
                        <span className="text-4xl">👔</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{outfit.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {outfit.items.length} items
                        </p>
                        <p className="text-xs text-gray-500">
                          Created {outfit.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}