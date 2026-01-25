import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Heart } from 'lucide-react';

/**
 * Product Gallery Component with Advanced Magnification
 * @param {Object} props
 * @param {Array} props.images - Array of image URLs
 * @param {string} props.productName - Product name for alt text
 * @param {boolean} props.isFavorite - Favorite state
 * @param {Function} props.onToggleFavorite - Toggle favorite handler
 */
const ProductGallery = ({ images = [], productName, isFavorite, onToggleFavorite }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [lensStyle, setLensStyle] = useState({});
  const [thumbnailOffset, setThumbnailOffset] = useState(0);

  const mainImageRef = useRef(null);

  // Fallback for empty images
  const galleryImages = images.length > 0 ? images : ['https://via.placeholder.com/600x600?text=No+Image'];

  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;

    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the image
    let x = e.pageX - left - window.scrollX;
    let y = e.pageY - top - window.scrollY;

    // Boundary check
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    // Lens dimensions
    const lensSize = 150;
    const halfLens = lensSize / 2;

    // Lens position (centered on cursor)
    let lensX = x - halfLens;
    let lensY = y - halfLens;

    // Constrain lens to image boundaries
    lensX = Math.max(0, Math.min(lensX, width - lensSize));
    lensY = Math.max(0, Math.min(lensY, height - lensSize));

    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      display: 'block'
    });

    // Zoomed background position
    const bgX = (lensX / (width - lensSize)) * 100;
    const bgY = (lensY / (height - lensSize)) * 100;

    setZoomStyle({
      backgroundImage: `url(${galleryImages[selectedImage]})`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      backgroundSize: `${(width / lensSize) * 100}%`
    });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => {
    setShowZoom(false);
    setLensStyle({ display: 'none' });
  };

  const scrollThumbnails = (direction) => {
    const step = 80; // pixels
    if (direction === 'up') {
      setThumbnailOffset(prev => Math.min(0, prev + step));
    } else {
      setThumbnailOffset(prev => prev - step);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 relative">
      {/* Thumbnails Sidebar - Vertical */}
      <div className="hidden lg:flex flex-col items-center gap-2 w-20 flex-shrink-0">
        <button
          onClick={() => scrollThumbnails('up')}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
          disabled={thumbnailOffset === 0}
        >
          <ChevronUp className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex-1 overflow-hidden h-[400px]">
          <div
            className="flex flex-col gap-3 transition-transform duration-300"
            style={{ transform: `translateY(${thumbnailOffset}px)` }}
          >
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${selectedImage === index
                  ? 'border-black shadow-md'
                  : 'border-transparent hover:border-gray-200'
                  }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollThumbnails('down')}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative flex-1 aspect-square bg-gray-50 rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
        <div
          className="w-full h-full cursor-crosshair relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={mainImageRef}
        >
          <img
            src={galleryImages[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />

          {/* Zoom Lens */}
          <div
            className="absolute border border-black border-opacity-20 bg-black bg-opacity-10 pointer-events-none z-10 hidden md:block"
            style={lensStyle}
          />

          {/* Favorite Heart Overlay */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-4 right-4 p-2.5 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110 z-20"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Mobile Preview Indicator (Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden px-3 py-1.5 bg-white bg-opacity-80 rounded-full backdrop-blur-sm">
          {galleryImages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${selectedImage === index ? 'bg-black w-4' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Magnified View Overlay (Always on the right of the gallery container) */}
      {showZoom && (
        <div
          className="absolute left-full ml-4 top-0 w-[500px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 hidden lg:block overflow-hidden"
          style={zoomStyle}
        />
      )}

      {/* Horizontal Thumbnails for Mobile */}
      <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === index ? 'border-black' : 'border-transparent'
              }`}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
