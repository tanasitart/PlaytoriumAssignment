import type { RefObject } from 'react';
import { useEffect } from 'react';

type EventHandler = (event: Event) => void;

const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: EventHandler
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
