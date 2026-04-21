import { DEFAULT_ENVIRONMENTS } from '@/config/app-data';
import { IEnvironment, IEnvVariable } from '@/types';

/**
 * Migrates legacy projects (flat variables[]) to the environments model.
 * If the project already has environments, returns them as-is.
 * Otherwise, wraps existing variables into a "development" environment
 * and creates empty staging/production environments.
 */
export function migrateProjectToEnvironments(doc: {
  environments?: IEnvironment[];
  variables?: IEnvVariable[];
}): IEnvironment[] {
  if (doc.environments && doc.environments.length > 0) {
    return doc.environments;
  }

  return DEFAULT_ENVIRONMENTS.map((name) => ({
    name,
    variables: name === 'development' ? (doc.variables ?? []) : [],
  }));
}
