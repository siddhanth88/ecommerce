import productsData from '../data/products.json';

const { config } = productsData;

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currencySymbol - Currency symbol (default: from config)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currencySymbol = config.currencySymbol) => {
  return `${currencySymbol}${price.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Calculate final price after discount
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} Final price
 */
export const applyDiscount = (price, discount) => {
  if (!discount || discount <= 0) return price;
  return price * (1 - discount / 100);
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: from config)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = config.currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
