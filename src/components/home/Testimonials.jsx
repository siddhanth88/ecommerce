import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Community Says</h2>
          <div className="w-12 h-1 bg-black mx-auto opacity-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center space-y-6 group">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-transparent group-hover:border-black p-1">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5 rounded-full">
                  <Quote className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-4 max-w-xs">
                <p className="text-gray-600 italic leading-relaxed">
                  "{item.quote}"
                </p>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">{item.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
