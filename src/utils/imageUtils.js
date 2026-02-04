/**
 * Utility to get the primary image for a product or cart item
 * Handles new colorVariants structure, base64 imageDataArray, and legacy fields
 */
export const getProductImage = (product) => {
  if (!product) return 'https://via.placeholder.com/300x400?text=No+Image';

  // 1. Check for selected color first (if it's a cart item or search result with selected variant)
  if (product.selectedColor && product.colorVariants && product.colorVariants.length > 0) {
    const variant = product.colorVariants.find(
      c => c.hexCode === product.selectedColor || c.name === product.selectedColor
    );
    if (variant && variant.images && variant.images.length > 0) {
      return variant.images[0];
    }
  }

  // 2. Check colorVariants for default or first color
  if (product.colorVariants && product.colorVariants.length > 0) {
    const defaultVariant = product.colorVariants.find(c => c.isDefault) || product.colorVariants[0];
    if (defaultVariant.images && defaultVariant.images.length > 0) {
      return defaultVariant.images[0];
    }
  }

  // 3. Check for base64 imageDataArray from backend (main product images)
  if (product.imageDataArray && product.imageDataArray.length > 0) {
    return product.imageDataArray[0];
  }

  // 4. Check for legacy images array
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  // 5. Check for single image field (sometimes used in cart items or specific API responses)
  if (product.image) return product.image;

  return 'https://via.placeholder.com/300x400?text=No+Image';
};
