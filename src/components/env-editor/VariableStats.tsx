'use client';

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnvVariable } from '@/lib/zod';

interface VariableStatsProps {
  variables: EnvVariable[];
}

export const VariableStats = memo(function VariableStats({
  variables,
}: VariableStatsProps) {
  const activeVariables = variables.filter((v) => v.key.trim()).length;
  const draftVariables = variables.filter((v) => !v.key.trim()).length;

  const stats = [
    {
      label: 'Active Variables',
      value: activeVariables,
      description: 'Variables with names',
    },
    {
      label: 'Draft Variables',
      value: draftVariables,
      description: 'Variables without names',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
