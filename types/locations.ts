// Ghana Regions for product location
export const GHANA_REGIONS = [
  { value: 'greater-accra', label: 'Greater Accra' },
  { value: 'ashanti', label: 'Ashanti Region' },
  { value: 'western', label: 'Western Region' },
  { value: 'central', label: 'Central Region' },
  { value: 'eastern', label: 'Eastern Region' },
  { value: 'volta', label: 'Volta Region' },
  { value: 'northern', label: 'Northern Region' },
  { value: 'upper-east', label: 'Upper East Region' },
  { value: 'upper-west', label: 'Upper West Region' },
  { value: 'brong-ahafo', label: 'Brong-Ahafo Region' },
  { value: 'western-north', label: 'Western North Region' },
  { value: 'ahafo', label: 'Ahafo Region' },
  { value: 'bono', label: 'Bono Region' },
  { value: 'bono-east', label: 'Bono East Region' },
  { value: 'oti', label: 'Oti Region' },
  { value: 'savannah', label: 'Savannah Region' },
  { value: 'north-east', label: 'North East Region' },
] as const;

export const STOCK_STATUS = [
  { value: 'in-stock', label: '✅ In Stock - Ready to Ship', color: 'text-green-600' },
  { value: 'limited', label: '⚠️ Limited Stock', color: 'text-amber-600' },
  { value: 'on-order', label: '📦 Available on Order', color: 'text-blue-600' },
  { value: 'out-of-stock', label: '❌ Out of Stock', color: 'text-red-600' },
] as const;

export const PRODUCT_CONDITION = [
  { value: 'new', label: '🆕 Brand New', description: 'Never used, in original packaging' },
  { value: 'used-like-new', label: '✨ Used - Like New', description: 'Minimal use, excellent condition' },
  { value: 'used-good', label: '👍 Used - Good', description: 'Normal wear, fully functional' },
  { value: 'used-fair', label: '⚙️ Used - Fair', description: 'Shows wear, may need minor repairs' },
] as const;
