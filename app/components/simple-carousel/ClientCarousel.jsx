'use client';

import { useState, useEffect } from 'react';
import Carousel from './Carousel';

export default function ClientCarousel({ slides, classN, autoPlayInterval, width }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <Carousel
      slides={slides}
      classN={classN}
      autoPlayInterval={autoPlayInterval}
      width={width}
    />
  );
}