import { STOCK_STATUS, PRODUCT_CONDITION } from '@/types/locations';

export function getStockStatusDisplay(status: string) {
  const statusItem = STOCK_STATUS.find(s => s.value === status);
  return statusItem || { label: '✅ In Stock', color: 'text-green-600' };
}

export function getConditionDisplay(condition: string) {
  const condItem = PRODUCT_CONDITION.find(c => c.value === condition);
  return condItem || { label: '🆕 Brand New', description: 'Never used, in original packaging' };
}
