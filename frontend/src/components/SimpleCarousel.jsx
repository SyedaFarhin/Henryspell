import React, { useState, useEffect } from 'react';

const SimpleCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: '/slideone.png',
      tagline: 'Grounded spiritual support for real life.'
    },
    {
      image: '/slide2.png',
      tagline: 'Where intuition meets discernment.'
    },
    {
      image: '/slide3.png',
      tagline: 'Clear insight. Honest guidance. Practical direction.'
    },
    {
      image: '/slidefour.png',
      tagline: 'Clear insight. Honest guidance. Practical direction.'
    },
    {
      image: '/slide5.png',
      tagline: 'Clear insight. Honest guidance. Practical direction.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
             className="
  w-full h-full
  object-contain sm:object-cover
  object-center
"

              onError={(e) => {
                console.log(`Failed to load image: ${slide.image}`);
                e.target.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Centered Tagline */}
            {/* <div className="absolute inset-0 flex items-center justify-center px-4">
              <h1 
                className="text-white text-center leading-tight tracking-wide max-w-4xl mx-auto"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  fontFamily: 'Georgia, serif'
                }}
              >
                {slide.tagline}
              </h1>
            </div> */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`block h-3 cursor-pointer rounded-full transition-all ${
              currentSlide === index ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="absolute top-4 left-4 bg-red-500 text-white p-2 z-30 text-sm">
        Slide {currentSlide + 1} of {slides.length}
      </div>
    </div>
  );
};

export default SimpleCarousel;
