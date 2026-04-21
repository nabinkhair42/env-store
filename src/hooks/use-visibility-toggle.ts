import { useCallback, useState } from 'react';

export function useVisibilityToggle() {
  // Track which values are HIDDEN (inverted from before — values are visible by default)
  const [hiddenValues, setHiddenValues] = useState<Set<number>>(new Set());

  const toggleVisibility = useCallback((index: number) => {
    setHiddenValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const shiftIndices = useCallback((offset: number) => {
    setHiddenValues((prev) => {
      const newSet = new Set<number>();
      prev.forEach((index) => {
        const newIndex = index + offset;
        if (newIndex >= 0) {
          newSet.add(newIndex);
        }
      });
      return newSet;
    });
  }, []);

  return {
    hiddenValues,
    toggleVisibility,
    shiftIndices,
  };
}
