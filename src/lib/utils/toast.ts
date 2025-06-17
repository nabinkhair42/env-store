import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4500,
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  dismiss: (id?: string | number) => {
    return sonnerToast.dismiss(id);
  },

  // EnvSync specific toasts
  projectCreated: (projectName: string) => {
    return toast.success("Project created successfully", `"${projectName}" is now ready for environment variables.`);
  },

  projectUpdated: (projectName: string) => {
    return toast.success("Project updated", `Changes to "${projectName}" have been saved.`);
  },

  projectDeleted: (projectName: string) => {
    return toast.success("Project deleted", `"${projectName}" and all its environment variables have been removed.`);
  },

  envVariableAdded: (variableName: string) => {
    return toast.success("Variable added", `"${variableName}" has been added to your project.`);
  },

  envVariableUpdated: (variableName: string) => {
    return toast.info("Variable updated", `"${variableName}" has been modified.`);
  },

  envVariableDeleted: (variableName: string) => {
    return toast.warning("Variable removed", `"${variableName}" has been deleted from your project.`);
  },

  exportSuccess: (format: string) => {
    return toast.success("Export completed", `Your environment variables have been exported as ${format}.`);
  },

  importSuccess: (count: number) => {
    return toast.success("Import completed", `Successfully imported ${count} environment variable${count !== 1 ? 's' : ''}.`);
  },

  authError: () => {
    return toast.error("Authentication failed", "Please sign in to continue using EnvSync.");
  },

  networkError: () => {
    return toast.error("Connection error", "Please check your internet connection and try again.");
  },

  validationError: (field: string) => {
    return toast.error("Validation error", `Please check the ${field} field and try again.`);
  },
};
