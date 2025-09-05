'use client';

import { Button } from '@/components/ui/button';
import { useEncryptedData } from '@/hooks/useEncryptedData';
import { useProjects } from '@/hooks/useProjects';
import { useVariableManager } from '@/hooks/useVariables';
import { useVisibilityToggle } from '@/hooks/useVisibilityToggle';
import { SimpleCrypto } from '@/lib/simple-crypto';
import { IProject } from '@/lib/types';
import { downloadFile, generateEnvFile } from '@/lib/utils/env-parser';
import { EnvVariable } from '@/lib/zod';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Loader2,
  Plus,
  Save,
  Shield,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FileUploadSection } from './FileUploadSection';
import { VariablesList } from './VariablesList';

interface EnvEditorProps {
  project: IProject;
  onUpdate: () => void;
}

export function EnvEditor({ project, onUpdate }: EnvEditorProps) {
  const { updateProject } = useProjects();
  const { data: _session, status: sessionStatus } = useSession();
  const { decryptIfNeeded } = useEncryptedData({
    userId: project.userId || '',
    salt: project.userSalt || '',
  });
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // Simple test of decryption when project loads
  useEffect(() => {
    if (project.variables && project.variables.length > 0) {
      const firstEncryptedVar = project.variables.find(
        (v) =>
          typeof v.value === 'object' &&
          v.value !== null &&
          'ciphertext' in v.value
      );

      if (firstEncryptedVar) {
        console.log('Testing decryption for:', firstEncryptedVar.key);
        decryptIfNeeded(firstEncryptedVar.value)
          .then((decrypted) => {
            console.log('Decryption successful:', decrypted);
          })
          .catch((error) => {
            console.error('Decryption failed:', error);
          });
      }

      // Test fresh encryption/decryption to verify the system works
      if (project.userId && project.userSalt) {
        console.log('Testing fresh encryption/decryption...');
        const testValue = 'test_value_123';
        const userId = project.userId;
        const salt = project.userSalt;
        SimpleCrypto.encrypt(testValue, userId, salt)
          .then((encrypted) => {
            console.log('Fresh encryption successful:', encrypted);
            return SimpleCrypto.decrypt(encrypted, userId, salt);
          })
          .then((decrypted) => {
            console.log('Fresh decryption result:', decrypted);
            console.log(
              'Fresh test result:',
              decrypted === testValue ? 'PASS' : 'FAIL'
            );
          })
          .catch((error) => {
            console.error('Fresh encryption/decryption test failed:', error);
          });
      }
    }
  }, [project.variables, project.userId, project.userSalt, decryptIfNeeded]);

  const {
    variables,
    setVariables,
    addVariable,
    updateVariable,
    deleteVariable,
    clearVariables,
    hasChanges,
  } = useVariableManager(project.variables || []);

  const { toggleVisibility, visibleValues } = useVisibilityToggle();

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaveStatus('saving');
    try {
      await updateProject(project._id as string, {
        variables: variables,
      });
      setSaveStatus('saved');
      onUpdate();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleExport = async () => {
    // Only export plain text variables for now
    const plainTextVariables = variables
      .filter((v) => typeof v.value === 'string')
      .map((v) => ({
        key: v.key,
        value: v.value as string,
        description: v.description,
      }));
    const envContent = generateEnvFile(plainTextVariables);
    downloadFile(envContent, `${project.name}.env`);
  };

  const handleCopyAll = async () => {
    // Only copy plain text variables for now
    const plainTextVariables = variables
      .filter((v) => typeof v.value === 'string')
      .map((v) => ({
        key: v.key,
        value: v.value as string,
        description: v.description,
      }));
    const envContent = generateEnvFile(plainTextVariables);
    try {
      await navigator.clipboard.writeText(envContent);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleImport = (importedVariables: EnvVariable[]) => {
    // Use bulkAddVariables instead of individual addVariable calls
    // This will handle duplicates and merging properly
    const currentVariables = variables;
    setVariables([...currentVariables, ...importedVariables]);
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Please sign in to access this project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
            className="flex items-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
                ? 'Saved'
                : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <FileUploadSection onFileVariables={handleImport} />

      {/* Variables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {variables.length} Active Variables
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* Toggle all visibility */
              }}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Toggle Values
            </Button>
          </div>
          <VariablesList
            variables={variables}
            visibleValues={visibleValues}
            onAddVariable={addVariable}
            onUpdateVariable={updateVariable}
            onToggleVisibility={toggleVisibility}
            onDeleteVariable={deleteVariable}
            onSmartPaste={handleImport}
            userId={project.userId || ''}
            salt={project.userSalt || ''}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Add New Variable</h2>
          <div className="space-y-4">
            <Button onClick={addVariable} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Variable
            </Button>
          </div>
        </div>
      </div>

      {/* Clear All Confirmation */}
      <Button variant="destructive" size="sm" onClick={clearVariables}>
        Clear All Variables
      </Button>
    </div>
  );
}
