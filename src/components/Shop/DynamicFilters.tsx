"use client";
import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/currency';

interface FilterOption {
  label: string;
  value: string;
  color?: { hex: string };
  count?: number;
}

interface FilterConfig {
  _id: string;
  title: string;
  slug: { current: string };
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'size';
  options?: FilterOption[];
  priceRange?: {
    min: number;
    max: number;
    step: number;
  };
  enabled: boolean;
  sortOrder: number;
  showProductCount: boolean;
  collapsible: boolean;
  defaultExpanded: boolean;
}

interface DynamicFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  activeFilters: Record<string, any>;
  products?: any[]; // Add products prop to extract real data
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({ onFiltersChange, activeFilters, products = [] }) => {
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFilterConfigs();
  }, []);

  const fetchFilterConfigs = async () => {
    try {
      // Extract real data from products (excluding categories since CategoryDropdown handles that)
      const sizes = Array.from(new Set(
        products.flatMap(p => p.sizes || []).filter(Boolean)
      )).map(size => ({ label: size.toUpperCase(), value: size.toLowerCase() }));

      const colors = Array.from(new Set(
        products.flatMap(p => {
          if (Array.isArray(p.colors)) {
            return p.colors.map(c => typeof c === 'string' ? c : c.name).filter(Boolean);
          }
          return [];
        })
      )).map(color => ({ label: color, value: color.toLowerCase() }));

      const genders = Array.from(new Set(
        products.map(p => p.gender).filter(Boolean)
      )).map(gender => ({ label: gender.charAt(0).toUpperCase() + gender.slice(1), value: gender.toLowerCase() }));

      const configs: FilterConfig[] = [];

      // Note: Categories are handled by CategoryDropdown component, so we don't add them here

      // Add sizes filter if we have sizes
      if (sizes.length > 0) {
        configs.push({
          _id: 'sizes',
          title: 'Sizes',
          slug: { current: 'sizes' },
          type: 'checkbox',
          options: sizes,
          enabled: true,
          sortOrder: 1,
          showProductCount: false,
          collapsible: true,
          defaultExpanded: false
        });
      }

      // Add colors filter if we have colors
      if (colors.length > 0) {
        configs.push({
          _id: 'colors',
          title: 'Colors',
          slug: { current: 'colors' },
          type: 'checkbox',
          options: colors,
          enabled: true,
          sortOrder: 2,
          showProductCount: false,
          collapsible: true,
          defaultExpanded: false
        });
      }

      // Add gender filter if we have genders
      if (genders.length > 0) {
        configs.push({
          _id: 'gender',
          title: 'Gender',
          slug: { current: 'gender' },
          type: 'checkbox',
          options: genders,
          enabled: true,
          sortOrder: 3,
          showProductCount: false,
          collapsible: true,
          defaultExpanded: false
        });
      }

      setFilterConfigs(configs);

      // Set initial expanded state
      const initialExpanded: Record<string, boolean> = {};
      configs.forEach((config: FilterConfig) => {
        initialExpanded[config.slug.current] = config.defaultExpanded;
      });
      setExpandedFilters(initialExpanded);

      setLoading(false);
    } catch (error) {
      console.error('Error setting up filter configs:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterSlug: string, value: any, isMultiple = false) => {
    const newFilters = { ...activeFilters };
    
    if (isMultiple) {
      if (!newFilters[filterSlug]) {
        newFilters[filterSlug] = [];
      }
      
      const currentValues = newFilters[filterSlug];
      if (currentValues.includes(value)) {
        newFilters[filterSlug] = currentValues.filter((v: any) => v !== value);
      } else {
        newFilters[filterSlug] = [...currentValues, value];
      }
      
      // Remove empty arrays
      if (newFilters[filterSlug].length === 0) {
        delete newFilters[filterSlug];
      }
    } else {
      if (newFilters[filterSlug] === value) {
        delete newFilters[filterSlug];
      } else {
        newFilters[filterSlug] = value;
      }
    }
    
    onFiltersChange(newFilters);
  };

  const toggleFilterExpansion = (filterSlug: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterSlug]: !prev[filterSlug]
    }));
  };

  const renderFilterOptions = (config: FilterConfig) => {
    const filterSlug = config.slug.current;
    const isExpanded = expandedFilters[filterSlug];
    
    if (config.collapsible && !isExpanded) {
      return null;
    }

    switch (config.type) {
      case 'checkbox':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters[filterSlug]?.includes(option.value) || false}
                  onChange={() => handleFilterChange(filterSlug, option.value, true)}
                  className="rounded border-gray-300 text-danios-black focus:ring-danios-black"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
                {config.showProductCount && option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={filterSlug}
                  checked={activeFilters[filterSlug] === option.value}
                  onChange={() => handleFilterChange(filterSlug, option.value)}
                  className="border-gray-300 text-danios-black focus:ring-danios-black"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
                {config.showProductCount && option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'color':
        return (
          <div className="flex flex-wrap gap-2">
            {config.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(filterSlug, option.value, true)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  activeFilters[filterSlug]?.includes(option.value)
                    ? 'border-danios-black scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: option.color?.hex || option.value }}
                title={option.label}
              />
            ))}
          </div>
        );

      case 'size':
        return (
          <div className="flex flex-wrap gap-2">
            {config.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(filterSlug, option.value, true)}
                className={`px-3 py-1 text-sm border rounded transition-all duration-200 ${
                  activeFilters[filterSlug]?.includes(option.value)
                    ? 'border-danios-black bg-danios-black text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {option.label}
                {config.showProductCount && option.count !== undefined && (
                  <span className="ml-1 text-xs opacity-75">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        );

      case 'range':
        if (!config.priceRange) return null;
        
        const currentMin = activeFilters[`${filterSlug}_min`] || config.priceRange.min;
        const currentMax = activeFilters[`${filterSlug}_max`] || config.priceRange.max;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  min={config.priceRange.min}
                  max={config.priceRange.max}
                  step={config.priceRange.step}
                  value={currentMin}
                  onChange={(e) => handleFilterChange(`${filterSlug}_min`, parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-danios-black focus:border-danios-black"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  min={config.priceRange.min}
                  max={config.priceRange.max}
                  step={config.priceRange.step}
                  value={currentMax}
                  onChange={(e) => handleFilterChange(`${filterSlug}_max`, parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-danios-black focus:border-danios-black"
                />
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              {formatPrice(currentMin)} - {formatPrice(currentMax)}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filterConfigs.map((config) => (
        <div key={config._id} className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{config.title}</h3>
            {config.collapsible && (
              <button
                onClick={() => toggleFilterExpansion(config.slug.current)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    expandedFilters[config.slug.current] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          {renderFilterOptions(config)}
        </div>
      ))}
    </div>
  );
};

export default DynamicFilters;
