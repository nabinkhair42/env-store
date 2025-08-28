import { useState, useCallback } from 'react';

export function useVisibilityToggle() {
  const [visibleValues, setVisibleValues] = useState<Set<number>>(new Set());

  const toggleVisibility = useCallback((index: number) => {
    setVisibleValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const hideAll = useCallback(() => {
    setVisibleValues(new Set());
  }, []);

  const showAll = useCallback((indices: number[]) => {
    setVisibleValues(new Set(indices));
  }, []);

  const shiftIndices = useCallback((offset: number) => {
    setVisibleValues((prev) => {
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
    visibleValues,
    toggleVisibility,
    hideAll,
    showAll,
    shiftIndices,
  };
}
