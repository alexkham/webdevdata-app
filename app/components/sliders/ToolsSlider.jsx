
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import styles from './ToolsSlider.module.css';

export default function ToolsSlider({ tools }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tools.length);
  }, [tools.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + tools.length) % tools.length);
  };

  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  return (
    <div className={styles.container}>
      <div 
        className={styles.content}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.info}>
          <h3 className={styles.toolTitle}>{tools[currentIndex].title}</h3>
          <p className={styles.description}>{tools[currentIndex].description}</p>
          <a href={tools[currentIndex].link} className={styles.button}>Try it</a>
        </div>

        <div className={styles.preview}>
          <div className={styles.imageWrapper}>
            <Image
              src={tools[currentIndex].image}
              alt={tools[currentIndex].title}
              fill
              priority={currentIndex === 0} // Load first image immediately
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className={styles.controls}>
            <button onClick={prevSlide} className={styles.controlButton}>
              <ChevronLeft className={styles.icon} />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className={styles.controlButton}>
              {isPlaying ? <Pause className={styles.icon} /> : <Play className={styles.icon} />}
            </button>
            <button onClick={nextSlide} className={styles.controlButton}>
              <ChevronRight className={styles.icon} />
            </button>
          </div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{width: `${(currentIndex + 1) * (100 / tools.length)}%`}} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}