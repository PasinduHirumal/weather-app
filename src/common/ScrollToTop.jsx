import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window smoothly (for mobile/tablet body scrolling)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Scroll any layout containers smoothly (for desktop layout column scrolling)
    const scrollContainers = document.querySelectorAll('.overflow-y-auto, [class*="overflow-y-auto"]');
    scrollContainers.forEach((container) => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [pathname]);

  return null;
}
