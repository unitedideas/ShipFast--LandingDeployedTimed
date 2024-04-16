import React, { useState, useEffect } from 'react';

const CustomSlider = ({ images, autoPlayDuration = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setTimeout(() => goToNext(), autoPlayDuration);
        return () => clearTimeout(timer);
    }, [currentIndex, autoPlayDuration, isPaused]);

    return (
        <div
            className="slider-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="slider-arrow left-arrow" onClick={goToPrevious}>
                <img src="/assets/svg_icons/LeftChevron.svg" alt="Previous"/>
            </div>
            <div className="slider-image-container">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index}`}
                        style={{display: index === currentIndex ? 'block' : 'none'}}
                    />
                ))}
            </div>
            <div className="slider-arrow right-arrow" onClick={goToNext}>
                <img src="/assets/svg_icons/RightChevron.svg" alt="Previous"/>
            </div>
            <div className="slider-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default CustomSlider;