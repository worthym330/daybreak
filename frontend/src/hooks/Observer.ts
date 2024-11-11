import { useRef, useState, useEffect } from "react";

export const useObserver = (onIntersect: (isVisible: boolean) => void) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting) {
        onIntersect(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect]);

  return { ref, isVisible };
};
