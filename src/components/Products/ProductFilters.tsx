import { Search, X } from 'lucide-react';

export interface FilterState {
  category: string;
  search: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name';
  inStockOnly: boolean;
  maxPrice: number;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const categories: { label: string; value: string }[] = [
  { label: 'All Meat', value: 'all' },
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Pork', value: 'pork' },
  { label: 'Lamb', value: 'lamb' },
  { label: 'Boerewors & Sausages', value: 'processed' },
  { label: 'Value Packs & Combos', value: 'packs' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Search Cuts
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search steak, wors, mince..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#E51E2A] focus:ring-1 focus:ring-[#E51E2A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onChange({ ...filters, category: cat.value })}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-colors ${
                filters.category === cat.value
                  ? 'bg-[#0B2B64] text-white font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.value && (
                <span className="w-2 h-2 rounded-full bg-[#E51E2A]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-bold text-[#E51E2A]">
            Up to R{filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="800"
          step="25"
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-[#E51E2A] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>R50</span>
          <span>R800+</span>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="rounded border-gray-300 text-[#E51E2A] focus:ring-[#E51E2A]"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Sort Products
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as FilterState['sortBy'],
            })
          }
          className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#0B2B64]"
        >
          <option value="featured">Featured / Best Seller</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Product Name (A-Z)</option>
        </select>
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
      >
        <X className="w-3.5 h-3.5" /> Reset Filters
      </button>

      <div className="text-[11px] text-gray-400 text-center">
        Showing {totalResults} products
      </div>
    </div>
  );
};
