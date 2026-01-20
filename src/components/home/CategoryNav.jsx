import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = ({
  categories,
  autoScroll = true,
  scrollSpeed = 1,
  autoScrollInterval = 20,
  imageSize = 120,
  gap = 48,
  showButtons = true,
  buttonScrollAmount = 300,
  showEdgeFade = true
}) => {
  if (!categories || categories.length === 0) return null;

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const isPausedRef = useRef(false);

  /* ---------------- AUTO SCROLL (REAL FIX) ---------------- */
  useEffect(() => {
    if (!autoScroll) return;

    const el = scrollRef.current;
    if (!el) return;

    // ❗ Only auto-scroll if overflow exists
    if (el.scrollWidth <= el.clientWidth) return;

    autoScrollRef.current = setInterval(() => {
      if (isPausedRef.current) return;

      el.scrollLeft += scrollSpeed;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
    }, autoScrollInterval);

    return () => clearInterval(autoScrollRef.current);
  }, [autoScroll, scrollSpeed, autoScrollInterval]);

  /* ---------------- BUTTON SCROLL (PAUSES AUTO) ---------------- */
  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;

    isPausedRef.current = true;

    el.scrollBy({ left: amount, behavior: 'smooth' });

    // Resume auto-scroll after user interaction
    setTimeout(() => {
      isPausedRef.current = false;
    }, 1200);
  };

  return (
    <nav className="relative py-10 bg-white">
      <div className="relative max-w-7xl mx-auto px-4">

        {/* LEFT BUTTON */}
        {showButtons && (
          <button
            onClick={() => scrollByAmount(-buttonScrollAmount)}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10
              h-10 w-10 items-center justify-center rounded-full
              bg-white/90 backdrop-blur
              shadow hover:scale-110 transition"
          >
            ‹
          </button>
        )}

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          style={{ gap }}
          className="category-scroll flex overflow-x-auto items-center"
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
        >
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={cat.link}
              className="flex flex-col items-center flex-shrink-0 group"
            >
              <div
                style={{ width: imageSize, height: imageSize }}
                className="rounded-full overflow-hidden bg-white
                  shadow-md transition-transform duration-300
                  group-hover:scale-110"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="mt-4 text-sm font-medium text-gray-700 group-hover:text-black">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* RIGHT BUTTON */}
        {showButtons && (
          <button
            onClick={() => scrollByAmount(buttonScrollAmount)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10
              h-10 w-10 items-center justify-center rounded-full
              bg-white/90 backdrop-blur
              shadow hover:scale-110 transition"
          >
            ›
          </button>
        )}
      </div>

      {/* EDGE FADE */}
      {showEdgeFade && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
        </>
      )}
    </nav>
  );
};

export default CategoryNav;
