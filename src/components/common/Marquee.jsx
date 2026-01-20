import React from 'react';

const Marquee = ({ items, speed = 20, pauseOnHover = true }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-black text-white py-4 overflow-hidden relative font-sans select-none">
      <div 
        className={`inline-flex whitespace-nowrap animate-marquee ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Original items */}
        {items.map((text, index) => (
          <span key={`original-${index}`} className="mx-8 text-sm font-medium tracking-[0.2em]">
            {text}
          </span>
        ))}
        {/* Duplicate items to fill space */}
        {items.map((text, index) => (
          <span key={`dup-${index}`} className="mx-8 text-sm font-medium tracking-[0.2em]">
            {text}
          </span>
        ))}
         {/* Triplicate items to fill wide space */}
        {items.map((text, index) => (
          <span key={`dup2-${index}`} className="mx-8 text-sm font-medium tracking-[0.2em]">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
