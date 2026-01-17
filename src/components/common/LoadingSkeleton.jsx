import React from 'react';

/**
 * Loading Skeleton Component
 * @param {Object} props
 * @param {string} props.variant - Skeleton variant: 'product-card', 'product-detail', 'text', 'image'
 * @param {number} props.count - Number of skeletons to render
 */
const LoadingSkeleton = ({ variant = 'product-card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'product-card':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] mb-3 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        );

      case 'product-detail':
        return (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gallery skeleton */}
              <div>
                <div className="bg-gray-200 aspect-square mb-4 rounded" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 aspect-square rounded" />
                  ))}
                </div>
              </div>

              {/* Info skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="space-y-2 mt-6">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        );

      case 'image':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
