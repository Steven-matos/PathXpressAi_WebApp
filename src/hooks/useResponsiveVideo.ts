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
    webm: isMobile ? '/assets/videos/city_intersection-mobile.webm' : '/assets/videos/city_intersection.webm',
    mp4: isMobile ? '/assets/videos/city_intersection-mobile.mp4' : '/assets/videos/city_intersection.mp4',
  };

  return videoSources;
} 