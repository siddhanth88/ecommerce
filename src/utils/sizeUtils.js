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

export const getDisplayPrice = (product, selectedSize, selectedColor) => {
  if (!product) return 0;
  
  // Try new colorVariants structure first
  if (product.colorVariants && product.colorVariants.length > 0) {
     // Use selected color or default to first/default
     let variant = null;
     if (selectedColor) {
       // selectedColor could be hex or name (ProductDetail often uses index, strictly we might need index or identifier)
       // Assuming selectedColor is passed as identifier (hex or name) or we rely on caller to pass the variant object?
       // Let's assume the caller passes the color identifier handled in ProductDetail (which uses index for state)
       // Ideally, ProductDetail should compute the price itself or pass the *Variant Object*. 
       // Keeping signature simple: if selectedColor is a HEX or Name string.
       variant = product.colorVariants.find(c => c.hexCode === selectedColor || c.name === selectedColor);
     }
     
     // Fallback if no specific color selected, maybe price range or base?
     // Actually, if we are here, we want a specific price.
     
      if (variant) {
          // If size is selected, find that specific price
          if (selectedSize && variant.sizes) {
              const sizeObj = variant.sizes.find(s => s.size === selectedSize);
              if (sizeObj && sizeObj.price) return sizeObj.price;
          }
          
          // If no size selected or specific size not found, use the first size price from this color variant
          if (variant.sizes && variant.sizes.length > 0) {
              // Prefer isDefault size or just the first one
              const defaultSize = variant.sizes.find(s => s.isDefault) || variant.sizes[0];
              if (defaultSize && defaultSize.price) return defaultSize.price;
          }
      }
     
     // What if only color is selected but no size? 
     // Or what if we need to return base price?
  }

  const sizeToUse = selectedSize; // || getLeastAvailableSize(product); // Don't auto-select size for price if not user-selected?

  if (sizeToUse && product.size_variants?.[sizeToUse]) {
    return product.size_variants[sizeToUse].price;
  }
  
  return product.price;
};
