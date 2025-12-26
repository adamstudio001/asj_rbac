import { useRef } from "react";

export function useLongPress(callback, ms = 600) {
  const timer = useRef();

  const start = (e) => {
    timer.current = setTimeout(() => callback(e), ms);
  };

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onTouchCancel: clear,
  };
}
