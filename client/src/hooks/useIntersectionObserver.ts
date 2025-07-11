import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<Element | null>(null);

  const { triggerOnce = false, ...observerOptions } = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);

        if (triggerOnce && isCurrentlyIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      observerOptions
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasTriggered, triggerOnce, observerOptions]);

  return {
    ref: targetRef,
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting,
  };
}

// Hook for infinite scrolling
export function useInfiniteScroll(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, isFetching, options]);

  const finishFetching = () => {
    setIsFetching(false);
  };

  return {
    ref: targetRef,
    isFetching,
    finishFetching,
  };
}