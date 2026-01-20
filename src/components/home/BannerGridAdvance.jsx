import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Advanced Banner Grid with Auto-Layout Detection
 * 
 * Automatically selects optimal layout based on banner count and types:
 * - 1 large: Full width hero
 * - 1 large + 2-4 small: Asymmetric 60/40 split
 * - All small (3-6): Responsive grid (3 cols desktop, 2 tablet, 1 mobile)
 * - All small (7+): Masonry-style grid
 * - Mixed large: Alternating full-width sections
 */

const BannerGridAdvanced = ({ banners, layout = 'auto' }) => {
  if (!banners || banners.length === 0) return null;

  const largeBanners = banners.filter(b => b.type === 'large');
  const smallBanners = banners.filter(b => b.type === 'small');

  // Auto-detect optimal layout
  const getLayout = () => {
    if (layout !== 'auto') return layout;

    // 1 large banner only
    if (largeBanners.length === 1 && smallBanners.length === 0) {
      return 'hero';
    }
    
    // 1 large + small banners
    if (largeBanners.length === 1 && smallBanners.length > 0) {
      return 'asymmetric';
    }
    
    // Multiple large banners
    if (largeBanners.length > 1) {
      return 'stacked-large';
    }
    
    // All small banners
    if (smallBanners.length <= 6) {
      return 'grid';
    }
    
    return 'masonry';
  };

  const selectedLayout = getLayout();

  return (
    <section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto">
        {selectedLayout === 'hero' && <HeroLayout banner={largeBanners[0]} />}
        {selectedLayout === 'asymmetric' && (
          <AsymmetricLayout large={largeBanners[0]} small={smallBanners} />
        )}
        {selectedLayout === 'stacked-large' && <StackedLayout banners={largeBanners} />}
        {selectedLayout === 'grid' && <GridLayout banners={smallBanners} />}
        {selectedLayout === 'masonry' && <MasonryLayout banners={smallBanners} />}
      </div>
    </section>
  );
};

/**
 * Layout 1: Hero - Single Large Banner (Full Width)
 */
const HeroLayout = ({ banner }) => (
  <div className="w-full">
    <BannerCard banner={banner} size="hero" />
  </div>
);

/**
 * Layout 2: Asymmetric - 1 Large + Small Banners (60/40 Split)
 */
const AsymmetricLayout = ({ large, small }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
    {/* Large Banner - 60% */}
    <div className="lg:col-span-7">
      <BannerCard banner={large} size="large" />
    </div>
    
    {/* Small Banners Stack - 40% */}
    <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 auto-rows-fr">
      {small.map((banner) => (
        <BannerCard key={banner.id} banner={banner} size="small" />
      ))}
    </div>
  </div>
);

/**
 * Layout 3: Stacked Large - Multiple Large Banners
 */
const StackedLayout = ({ banners }) => (
  <div className="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10">
    {banners.map((banner, index) => (
      <BannerCard 
        key={banner.id} 
        banner={banner} 
        size={index === 0 ? 'hero' : 'large'} 
      />
    ))}
  </div>
);

/**
 * Layout 4: Grid - Small Banners (3 Columns)
 */
const GridLayout = ({ banners }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {banners.map((banner) => (
      <BannerCard key={banner.id} banner={banner} size="small" />
    ))}
  </div>
);

/**
 * Layout 5: Masonry - Many Small Banners
 */
const MasonryLayout = ({ banners }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
    {banners.map((banner, index) => {
      // Make first banner span 2 columns for visual interest
      const isFeature = index === 0;
      return (
        <div key={banner.id} className={isFeature ? 'md:col-span-2' : ''}>
          <BannerCard banner={banner} size={isFeature ? 'medium' : 'small'} />
        </div>
      );
    })}
  </div>
);

/**
 * Universal Banner Card Component
 */
const BannerCard = ({ banner, size }) => {
  // Size configurations
  const sizeConfig = {
    hero: {
      aspectRatio: 'aspect-[21/9]',
      minHeight: 'min-h-[500px] lg:min-h-[600px]',
      padding: 'p-8 md:p-12 lg:p-16',
      titleSize: 'text-3xl md:text-5xl lg:text-6xl',
      subtitleSize: 'text-sm md:text-base',
      ctaSize: 'text-base md:text-lg',
      showDescription: true
    },
    large: {
      aspectRatio: 'aspect-[16/9]',
      minHeight: 'min-h-[400px] lg:min-h-[500px]',
      padding: 'p-6 md:p-10 lg:p-12',
      titleSize: 'text-2xl md:text-4xl lg:text-5xl',
      subtitleSize: 'text-xs md:text-sm',
      ctaSize: 'text-sm md:text-base',
      showDescription: true
    },
    medium: {
      aspectRatio: 'aspect-[4/3]',
      minHeight: 'min-h-[350px] lg:min-h-[400px]',
      padding: 'p-5 md:p-8 lg:p-10',
      titleSize: 'text-xl md:text-3xl lg:text-4xl',
      subtitleSize: 'text-xs md:text-sm',
      ctaSize: 'text-sm md:text-base',
      showDescription: false
    },
    small: {
      aspectRatio: 'aspect-[4/3]',
      minHeight: 'min-h-[280px] lg:min-h-0',
      padding: 'p-5 md:p-7 lg:p-8',
      titleSize: 'text-xl md:text-2xl lg:text-3xl',
      subtitleSize: 'text-[10px] md:text-xs',
      ctaSize: 'text-xs md:text-sm',
      showDescription: false
    }
  };

  const config = sizeConfig[size] || sizeConfig.small;

  return (
    <article 
      className={`
        relative overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl
        group cursor-pointer
        bg-gradient-to-br from-gray-100 to-gray-200
        shadow-lg hover:shadow-2xl
        transition-all duration-500 ease-out
        ${config.aspectRatio}
        ${config.minHeight}
        hover:-translate-y-1
      `}
    >
      <Link 
        to={banner.link} 
        className="block w-full h-full"
        aria-label={`${banner.title} - ${banner.ctaText || 'Learn more'}`}
      >
        
        {/* Image Container with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Content Wrapper */}
        <div className={`
          absolute inset-0 flex flex-col justify-end
          ${config.padding}
        `}>
          
          {/* Animated Content Container */}
          <div className="transform transition-all duration-300 group-hover:-translate-y-2">
            
            {/* Subtitle/Category Tag */}
            {banner.subtitle && (
              <div className="mb-2 md:mb-3">
                <span className={`
                  inline-block px-3 py-1 
                  bg-white/20 backdrop-blur-sm
                  text-white uppercase tracking-[0.2em] font-semibold
                  rounded-full border border-white/30
                  ${config.subtitleSize}
                  transform transition-all duration-300
                  group-hover:bg-white/30 group-hover:scale-105
                `}>
                  {banner.subtitle}
                </span>
              </div>
            )}

            {/* Main Title */}
            <h2 className={`
              text-white font-bold leading-tight mb-3 md:mb-4
              ${config.titleSize}
              tracking-tight
              drop-shadow-2xl
              [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]
            `}>
              {banner.title}
            </h2>

            {/* Description (for hero and large only) */}
            {config.showDescription && banner.description && (
              <p className="text-white/90 text-sm md:text-base lg:text-lg mb-4 md:mb-6 max-w-2xl leading-relaxed line-clamp-2">
                {banner.description}
              </p>
            )}

            {/* CTA Button with Arrow Animation */}
            <div className="inline-flex items-center gap-2 group/cta">
              <span className={`
                ${config.ctaSize}
                text-white font-bold uppercase tracking-wider
                border-b-2 border-white/80 pb-1
                transition-all duration-300
                group-hover:border-white group-hover:pr-3
              `}>
                {banner.ctaText || 'Explore Now'}
              </span>
              <ArrowRight 
                className={`
                  w-5 h-5 text-white
                  opacity-0 -translate-x-3
                  transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-x-0
                `}
              />
            </div>
          </div>
        </div>

        {/* Subtle Border Glow on Hover */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 pointer-events-none" />
        
        {/* Corner Accent (optional decorative element) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
        
      </Link>
    </article>
  );
};

// Named exports for individual layouts
export { HeroLayout, AsymmetricLayout, StackedLayout, GridLayout, MasonryLayout };

// Default export
export default BannerGridAdvanced;

/**
 * USAGE EXAMPLES
 * 
 * 1. Auto Layout (Recommended)
 * <BannerGridAdvanced banners={banners} />
 * 
 * 2. Force Specific Layout
 * <BannerGridAdvanced banners={banners} layout="grid" />
 * 
 * 3. Use Individual Layout Components
 * <AsymmetricLayout large={largeBanner} small={smallBanners} />
 * 
 * Available Layouts: 'auto', 'hero', 'asymmetric', 'stacked-large', 'grid', 'masonry'
 */