export const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];

export const sortSizes = (sizes) => {
  if (!sizes) return [];
  return [...sizes].sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a);
    const indexB = SIZE_ORDER.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // Numeric sort for other sizes (shoes, etc.)
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    
    return a.localeCompare(b);
  });
};

export const getLeastAvailableSize = (product) => {
  if (!product) return '';
  const available = product.available_sizes || [];
  const allSizes = product.sizes || [];
  
  const sortedAvailable = sortSizes(available);
  if (sortedAvailable.length > 0) return sortedAvailable[0];
  
  const sortedAll = sortSizes(allSizes);
  return sortedAll.length > 0 ? sortedAll[0] : '';
};

export const getDisplayPrice = (product, selectedSize) => {
  if (!product) return 0;
  
  const sizeToUse = selectedSize || getLeastAvailableSize(product);
  
  if (sizeToUse && product.size_variants?.[sizeToUse]) {
    return product.size_variants[sizeToUse].price;
  }
  
  return product.price;
};
