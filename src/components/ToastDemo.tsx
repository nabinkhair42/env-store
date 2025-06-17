"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/utils/toast';

export function ToastDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>
          Test the different types of toast notifications in EnvSync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => toast.success('Success!', 'Operation completed successfully.')}
          >
            Success
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => toast.error('Error!', 'Something went wrong.')}
          >
            Error
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.warning('Warning!', 'Please be careful.')}
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.info('Info!', 'Here\'s some information.')}
          >
            Info
          </Button>
        </div>
        
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium mb-2">EnvSync Specific</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.projectCreated('My Project')}
            >
              Project Created
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.envVariableAdded('API_KEY')}
            >
              Variable Added
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.exportSuccess('.env file')}
            >
              Export Success
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
