'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  onFilterChange: (filters: { mainCategory?: string; subCategory?: string }) => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');

  const handleMainCategoryChange = (value: string) => {
    setMainCategory(value);
    setSubCategory('');
    if (value === 'all') {
      onFilterChange({});
    } else {
      onFilterChange({ mainCategory: value });
    }
  };

  const handleSubCategoryChange = (value: string) => {
    setSubCategory(value);
    if (value === 'all') {
      onFilterChange({ mainCategory });
    } else {
      onFilterChange({ mainCategory, subCategory: value });
    }
  };

  const handleClearFilters = () => {
    setMainCategory('');
    setSubCategory('');
    onFilterChange({});
  };

  const selectedMainCategory = mainCategory && mainCategory !== 'all' 
    ? Object.entries(CATEGORIES).find(([key]) => key === mainCategory)?.[1]
    : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-lg mb-4">Filter Products</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Main Category</label>
          <Select value={mainCategory} onValueChange={handleMainCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <SelectItem key={key} value={key}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMainCategory && (
          <div>
            <label className="text-sm font-medium mb-2 block">Sub Category</label>
            <Select value={subCategory} onValueChange={handleSubCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {selectedMainCategory.subcategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(mainCategory || subCategory) && (
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
