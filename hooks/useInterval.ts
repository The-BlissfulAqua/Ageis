import React, { useState, useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  // Fix: Provide an initial value to `useRef` to satisfy the function's signature and prevent a TypeScript error.
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
