import { useState, useCallback } from "react";

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

  return {
    visibleValues,
    toggleVisibility,
    hideAll,
    showAll,
  };
}
