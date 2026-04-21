import { DEFAULT_ENVIRONMENTS, MAX_ENVIRONMENTS } from '@/config/app-data';
import { EnvVariable } from '@/schema';
import { IEnvironment } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useEnvironmentManager(initialEnvironments: IEnvironment[]) {
  const [activeTab, setActiveTab] = useState(
    initialEnvironments[0]?.name ?? DEFAULT_ENVIRONMENTS[0],
  );

  // Store per-environment variables in a map so edits survive tab switches
  const [envMap, setEnvMap] = useState<Map<string, EnvVariable[]>>(() => {
    const map = new Map<string, EnvVariable[]>();
    for (const e of initialEnvironments) {
      map.set(e.name, e.variables);
    }
    return map;
  });

  const [envNames, setEnvNames] = useState<string[]>(
    initialEnvironments.map((e) => e.name),
  );

  // Track if we've been initialized to avoid overwriting edits on refetch
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    // Sync from server on refetch (e.g., after save)
    const map = new Map<string, EnvVariable[]>();
    const names: string[] = [];
    for (const e of initialEnvironments) {
      map.set(e.name, e.variables);
      names.push(e.name);
    }
    setEnvMap(map);
    setEnvNames(names);
    if (!names.includes(activeTab)) {
      setActiveTab(names[0] ?? DEFAULT_ENVIRONMENTS[0]);
    }
  }, [initialEnvironments]);

  const activeVariables = useMemo(
    () => envMap.get(activeTab) ?? [],
    [envMap, activeTab],
  );

  const updateVariables = useCallback(
    (envName: string, variables: EnvVariable[]) => {
      setEnvMap((prev) => {
        const next = new Map(prev);
        next.set(envName, variables);
        return next;
      });
    },
    [],
  );

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

  const getAllEnvironments = useCallback((): IEnvironment[] => {
    return envNames.map((name) => ({
      name,
      variables: (envMap.get(name) ?? []).filter((v) => v.key.trim()),
    }));
  }, [envNames, envMap]);

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
    updateVariables,
    addEnvironment,
    removeEnvironment,
    renameEnvironment,
    getAllEnvironments,
    totalVariableCount,
  };
}
