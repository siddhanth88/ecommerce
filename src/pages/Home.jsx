import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import Marquee from '../components/common/Marquee';
import FeaturedSection from '../components/home/FeaturedSection';
import Testimonials from '../components/home/Testimonials';
import CategoryNav from '../components/home/CategoryNav';

const Home = () => {
  const { homeConfig } = useProducts();

  if (!homeConfig) return null;

  const { hero, marquee, banners, featured, newsletter, testimonials, categoryNav } = homeConfig;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Hero Section - Immersive & Minimal */}
      {hero && (
        <section className="relative h-[90vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={hero.image}
              alt={hero.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="max-w-4xl space-y-6 animate-fade-in-up">
              {hero.subtitle && (
                <p className="text-white/90 text-sm md:text-base tracking-[0.4em] font-medium uppercase">
                  {hero.subtitle}
                </p>
              )}
              <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-none">
                {hero.title}
              </h1>
              <div className="pt-8">
                <Link
                  to={hero.ctaLink}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium tracking-widest text-sm overflow-hidden transition-all duration-300 hover:bg-black hover:text-white"
                >
                  <span className="relative z-10">{hero.ctaText}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marquee Section */}
      {marquee && marquee.length > 0 && (
        <section className="border-b border-gray-100">
          <Marquee items={marquee} speed={40} />
        </section>
      )}

      {categoryNav && (
        <CategoryNav
          categories={categoryNav}
          autoScroll={true}
          scrollSpeed={0.6}
          pauseOnHover={true}
          pauseOnTouch={true}
          imageSize={120}
          gap={56}
          showEdgeFade={true}
          centerOnDesktop={false}
        />

      )}

      {/* Bento Grid - Banners Section */}
      {banners && banners.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1920px] mx-auto">
          {/* 
            Grid Layout Strategy:
            Mobile: Stacked (grid-cols-1)
            Tablet/Desktop: 12-column grid
            - Large Banner: Spans 7 columns
            - Small Banners Stack: Spans 5 columns (stacked vertically)
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:min-h-[700px]">
            
            {/* Find Large Banner */}
            {banners.find(b => b.type === 'large') && (() => {
               const largeBanner = banners.find(b => b.type === 'large');
               return (
                <div className="lg:col-span-7 h-[500px] lg:h-auto relative group overflow-hidden bg-gray-100">
                  <Link to={largeBanner.link} className="block w-full h-full">
                    <img
                      src={largeBanner.image}
                      alt={largeBanner.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                      {largeBanner.subtitle && (
                        <span className="block text-sm tracking-widest mb-3 uppercase opacity-90">{largeBanner.subtitle}</span>
                      )}
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{largeBanner.title}</h2>
                      <span className="inline-flex items-center text-sm font-medium border-b border-white pb-1 group-hover:pl-2 transition-all duration-300">
                        {largeBanner.ctaText} <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </div>
                  </Link>
                </div>
               );
            })()}

            {/* Small Banners Column */}
            <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6 h-full min-h-[700px] lg:min-h-0">
              {banners.filter(b => b.type === 'small').map((banner) => (
                <div key={banner.id} className="relative flex-1 h-[300px] lg:h-auto group overflow-hidden bg-gray-100">
                  <Link to={banner.link} className="block w-full h-full">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{banner.title}</h3>
                      <span className="text-xs md:text-sm tracking-widest uppercase opacity-90 border-b border-transparent group-hover:border-white pb-1 transition-all">
                        {banner.ctaText}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured && (
        <div className="relative z-10 bg-white">
          <FeaturedSection data={featured} />
        </div>
      )}

      {/* Testimonials Section */}
      {testimonials && (
        <Testimonials testimonials={testimonials} />
      )}

      {/* Newsletter - Minimal */}
      {newsletter && (
        <section className="py-24 px-4 md:px-8 bg-white border-t border-gray-100">
          <div className="max-w-xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">{newsletter.title}</h2>
            <p className="text-gray-500 leading-relaxed">
              {newsletter.description}
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 px-4 py-4 bg-gray-50 border-none focus:ring-1 focus:ring-black placeholder:text-gray-400 text-sm w-full"
              />
              <button className="bg-black text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-gray-900 transition-all w-full sm:w-auto">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
