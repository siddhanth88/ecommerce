import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedSection = ({ data }) => {
  if (!data) return null;

  // Helper for safe title rendering
  const renderTitle = (title) => {
    if (!title) return null;
    return title.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < title.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/5] overflow-hidden bg-gray-200 w-full h-full shadow-lg">
              <img 
                src={data.image} 
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 md:order-2 flex flex-col justify-center space-y-8 text-center md:text-left h-full">
            <div>
              {data.subtitle && (
                <span className="inline-block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4">
                  {data.subtitle}
                </span>
              )}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                {renderTitle(data.title)}
              </h2>
            </div>
            
            <div className="w-12 h-1 bg-black mx-auto md:mx-0 opacity-20" />
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              {data.description}
            </p>
            
            <div className="pt-4">
              <Link 
                to={data.ctaLink} 
                className="group inline-flex items-center text-black font-semibold text-sm tracking-widest uppercase hover:text-gray-600 transition-colors border-b-2 border-transparent hover:border-black pb-1"
              >
                {data.ctaText}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
