'use client'
import React, { useState, useEffect } from 'react';

const SimpleCarousel = () => {
    const images = [
        "/fibonacci.jpeg",
        "/fibonacci2.jpg",
        "/fibonacci.jpg"
    ];
    const [activeIndex, setActiveIndex] = useState(0);

    // Function to go to next slide
    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % images.length);
    };

    // Function to go to previous slide
    const prevSlide = () => {
        setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };

    // Optional: Automatic cycling of slides
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slides every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', width: '600px', height: '400px', overflow: 'hidden' }}>
            {images.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Slide ${index}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        left: `${(index - activeIndex) * 100}%`,
                        transition: 'left 0.5s ease'
                    }}
                />
            ))}
            <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '10px', zIndex: 100 }}>Prev</button>
            <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '10px', zIndex: 100 }}>Next</button>
        </div>
    );
};

export default SimpleCarousel;
