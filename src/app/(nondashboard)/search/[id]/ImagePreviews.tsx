"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const DEFAULT_PROPERTY_IMAGE = "/singlelisting-2.jpg";

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use default image if no images provided
  const displayImages = images && images.length > 0 ? images : [DEFAULT_PROPERTY_IMAGE];

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[450px] w-full">
      {displayImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover cursor-pointer transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      
      {/* Navigation buttons - only show if more than 1 image */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300 hover:bg-opacity-70 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300 hover:bg-opacity-70 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="text-white" />
          </button>
          
          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {displayImages.length}
      </div>
    </div>
  );
};

export default ImagePreviews;
