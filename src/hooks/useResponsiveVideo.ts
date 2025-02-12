import { useEffect, useState } from 'react';

export function useResponsiveVideo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoSources = {
    webm: isMobile ? '/city_intersection-mobile.webm' : '/city_intersection.webm',
    mp4: isMobile ? '/city_intersection-mobile.mp4' : '/city_intersection.mp4',
  };

  return videoSources;
} 