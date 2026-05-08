import { DEFAULT_ENVIRONMENTS, MAX_ENVIRONMENTS } from '@/config/app-data';
import { EnvVariable } from '@/schema';
import { IEnvironment } from '@/types';
import { useCallback, useMemo, useState } from 'react';

// Single source of truth for environments + their variables.
// State is seeded once from the server payload; the parent remounts (via the
// route-driven `key`) when navigating between projects, so no sync effect.
export function useEnvironmentManager(initialEnvironments: IEnvironment[]) {
  const [activeTab, setActiveTab] = useState(
    () => initialEnvironments[0]?.name ?? DEFAULT_ENVIRONMENTS[0],
  );

  const [envMap, setEnvMap] = useState<Map<string, EnvVariable[]>>(() => {
    const map = new Map<string, EnvVariable[]>();
    for (const e of initialEnvironments) map.set(e.name, e.variables);
    return map;
  });

  const [envNames, setEnvNames] = useState<string[]>(
    () => initialEnvironments.map((e) => e.name),
  );

  const activeVariables = useMemo(
    () => envMap.get(activeTab) ?? [],
    [envMap, activeTab],
  );

  // --- Variable-level operations on the active tab ---

  const addVariable = useCallback(() => {
    setEnvMap((prev) => {
      const next = new Map(prev);
      const cur = prev.get(activeTab) ?? [];
      next.set(activeTab, [{ key: '', value: '' }, ...cur]);
      return next;
    });
  }, [activeTab]);

  const updateVariable = useCallback(
    (index: number, field: keyof EnvVariable, value: string) => {
      setEnvMap((prev) => {
        const cur = prev.get(activeTab) ?? [];
        const updated = cur.map((v, i) =>
          i === index ? { ...v, [field]: value } : v,
        );
        const next = new Map(prev);
        next.set(activeTab, updated);
        return next;
      });
    },
    [activeTab],
  );

  const deleteVariable = useCallback(
    (index: number) => {
      setEnvMap((prev) => {
        const next = new Map(prev);
        next.set(activeTab, (prev.get(activeTab) ?? []).filter((_, i) => i !== index));
        return next;
      });
    },
    [activeTab],
  );

  const bulkAddVariables = useCallback(
    (newVars: EnvVariable[]) => {
      setEnvMap((prev) => {
        const cur = [...(prev.get(activeTab) ?? [])];
        for (const v of newVars) {
          if (!v.key.trim()) continue;
          const idx = cur.findIndex(
            (existing) => existing.key.toLowerCase() === v.key.toLowerCase(),
          );
          if (idx >= 0) cur[idx] = v;
          else cur.push(v);
        }
        const next = new Map(prev);
        next.set(activeTab, cur);
        return next;
      });
    },
    [activeTab],
  );

  const getValidVariables = useCallback(
    () => (envMap.get(activeTab) ?? []).filter((v) => v.key.trim()),
    [envMap, activeTab],
  );

  // --- Environment-level operations ---

  const addEnvironment = useCallback(
    (name: string) => {
      if (envNames.includes(name) || envNames.length >= MAX_ENVIRONMENTS) return false;
      setEnvNames((prev) => [...prev, name]);
      setEnvMap((prev) => {
        const next = new Map(prev);
        next.set(name, []);
        return next;
      });
      setActiveTab(name);
      return true;
    },
    [envNames],
  );

  const removeEnvironment = useCallback(
    (name: string) => {
      if (envNames.length <= 1) return;
      setEnvNames((prev) => prev.filter((n) => n !== name));
      setEnvMap((prev) => {
        const next = new Map(prev);
        next.delete(name);
        return next;
      });
      if (activeTab === name) {
        setActiveTab(envNames.find((n) => n !== name) ?? envNames[0]);
      }
    },
    [envNames, activeTab],
  );

  const renameEnvironment = useCallback(
    (oldName: string, newName: string) => {
      if (envNames.includes(newName)) return false;
      setEnvNames((prev) => prev.map((n) => (n === oldName ? newName : n)));
      setEnvMap((prev) => {
        const next = new Map(prev);
        const vars = next.get(oldName) ?? [];
        next.delete(oldName);
        next.set(newName, vars);
        return next;
      });
      if (activeTab === oldName) setActiveTab(newName);
      return true;
    },
    [envNames, activeTab],
  );

  const getAllEnvironments = useCallback(
    (): IEnvironment[] =>
      envNames.map((name) => ({
        name,
        variables: (envMap.get(name) ?? []).filter((v) => v.key.trim()),
      })),
    [envNames, envMap],
  );

  const totalVariableCount = useMemo(() => {
    let count = 0;
    for (const vars of envMap.values()) {
      count += vars.filter((v) => v.key.trim()).length;
    }
    return count;
  }, [envMap]);

  return {
    envNames,
    activeTab,
    setActiveTab,
    activeVariables,
    addVariable,
    updateVariable,
    deleteVariable,
    bulkAddVariables,
    getValidVariables,
    addEnvironment,
    removeEnvironment,
    renameEnvironment,
    getAllEnvironments,
    totalVariableCount,
  };
}
