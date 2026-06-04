import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // '', 'Granite', 'Tile', 'Paint'
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available unique attributes for filters (dynamic list, or hardcoded for seed consistency)
  const colors = ['White', 'Black', 'Grey', 'Gold', 'Blue'];
  const finishes = ['Polished', 'Honed', 'Matte', 'Satin'];

  const fetchFilteredProducts = () => {
    setLoading(true);
    const filters = {
      category: selectedCategory,
      q: searchQuery,
      color: selectedColor,
      finish: selectedFinish,
      min_price: minPrice,
      max_price: maxPrice
    };

    api.getProducts(filters)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching catalog products:", err);
        setLoading(false);
      });
  };

  // Fetch when any filter state changes
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedColor, selectedFinish, minPrice, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProducts();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedColor('');
    setSelectedFinish('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="serif-title" style={{ fontSize: '36px' }}>Our Collection Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Browse and filter our exquisite range of natural granites, crafted wall/floor tiles, and premium architectural paints.
        </p>
      </div>

      {/* Main Layout Grid: Sidebar + Products list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <Filter size={18} color="var(--accent-gold)" /> Filters
            </div>
            <button 
              onClick={resetFilters} 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>



          {/* Category Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Material Category</label>
            <select 
              className="form-control" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Granite">Granite</option>
              <option value="Tile">Tiles</option>
              <option value="Paint">Paints</option>
            </select>
          </div>

          {/* Color Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Color Profile</label>
            <select 
              className="form-control" 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">All Colors</option>
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Finish Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Finish Profile</label>
            <select 
              className="form-control" 
              value={selectedFinish} 
              onChange={(e) => setSelectedFinish(e.target.value)}
            >
              <option value="">All Finishes</option>
              {finishes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Price Range ({selectedCategory === 'Paint' ? '₹/litre' : '₹/sqft'})</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="Min" 
                className="form-control" 
                style={{ width: '100%', padding: '8px' }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="form-control" 
                style={{ width: '100%', padding: '8px' }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID AREA */}
        <div>
          {/* Top Search Bar */}
          <form onSubmit={handleSearchSubmit} className="glass" style={{ 
            display: 'flex', 
            padding: '10px 16px', 
            borderRadius: 'var(--border-radius-md)', 
            marginBottom: '30px', 
            border: '1px solid var(--border-color)',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search by product name, description, color..." 
              className="form-control"
              style={{ 
                border: 'none', 
                backgroundColor: 'transparent', 
                padding: '4px 0', 
                width: '100%', 
                fontSize: '15px' 
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0 }}
            >
              Search
            </button>
          </form>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '100px 0',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--text-secondary)'
            }}>
              Analyzing minerals and loading materials catalog...
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '100px 20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--text-secondary)'
            }}>
              <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>No Materials Match Your Filters</p>
              <p style={{ fontSize: '13px' }}>Try resetting or modifying your filter parameters to view other products.</p>
              <button 
                onClick={resetFilters} 
                className="btn btn-secondary" 
                style={{ marginTop: '20px' }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
