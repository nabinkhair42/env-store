'use client';

import { AvatarGroup } from '@/components/ui/avatar-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy01Icon,
  Download01Icon,
  EyeIcon,
  SaveIcon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

const MEMBERS = [
  { name: 'Alex', image: 'https://i.pravatar.cc/150?u=alex-dev' },
  { name: 'Sarah', image: 'https://i.pravatar.cc/150?u=sarah-dev' },
  { name: 'James', image: 'https://i.pravatar.cc/150?u=james-dev' },
];

const ENVS = {
  development: [
    { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/myapp_dev', masked: true },
    { key: 'REDIS_URL', value: 'redis://localhost:6379', masked: false },
    { key: 'NEXT_PUBLIC_API_URL', value: 'http://localhost:3000/api', masked: false },
    { key: 'JWT_SECRET', value: 'dev-jwt-secret-key-not-for-prod', masked: true },
    { key: 'SMTP_HOST', value: 'localhost', masked: false },
  ],
  staging: [
    { key: 'DATABASE_URL', value: 'postgresql://staging.rds.amazonaws.com:5432/app', masked: true },
    { key: 'REDIS_URL', value: 'redis://staging.cache.amazonaws.com:6379', masked: true },
    { key: 'NEXT_PUBLIC_API_URL', value: 'https://staging-api.example.com', masked: false },
    { key: 'STRIPE_KEY', value: 'sk_test_xxxxxxxxxxxxxxxxxxxx', masked: true },
  ],
  production: [
    { key: 'DATABASE_URL', value: 'postgresql://prod.rds.amazonaws.com:5432/app', masked: true },
    { key: 'REDIS_URL', value: 'redis://prod.cache.amazonaws.com:6379', masked: true },
    { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.example.com', masked: false },
    { key: 'STRIPE_KEY', value: 'sk_live_xxxxxxxxxxxxxxxxxxxx', masked: true },
    { key: 'SENTRY_DSN', value: 'https://abc123def456@o123.ingest.sentry.io/789', masked: true },
    { key: 'S3_BUCKET', value: 'prod-assets-us-east-1', masked: false },
  ],
};

export function HeroMock() {
  const [activeEnv, setActiveEnv] = useState('production');
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const variables = ENVS[activeEnv as keyof typeof ENVS] ?? [];

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const resetOnTabChange = (env: string) => {
    setActiveEnv(env);
    setRevealed(new Set());
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-left shadow-2xl shadow-black/5">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="size-2.5 rounded-full bg-red-400/80" />
          <div className="size-2.5 rounded-full bg-yellow-400/80" />
          <div className="size-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 min-w-0 text-center">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground/60 font-mono truncate block">
            <span className="sm:hidden">envstore.nabinkhair.com.np</span>
            <span className="hidden sm:inline">envstore.nabinkhair.com.np/dashboard/prod-api</span>
          </span>
        </div>
        <div className="shrink-0 w-12 sm:w-16" />
      </div>

      {/* Project header */}
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">Production API</h3>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {variables.length} vars
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Backend API service · 3 environments
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <AvatarGroup items={MEMBERS} max={3} size="sm" />
          <ButtonGroup>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 sm:px-3">
              <HugeiconsIcon icon={Copy01Icon} size={12} />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 sm:px-3">
              <HugeiconsIcon icon={Download01Icon} size={12} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="h-7 text-xs px-2 sm:px-3">
              <HugeiconsIcon icon={SaveIcon} size={12} />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Environment tabs + variables */}
      <div className="px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
        <Tabs value={activeEnv} onValueChange={resetOnTabChange}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="development" className="text-xs flex-1 sm:flex-initial">dev</TabsTrigger>
            <TabsTrigger value="staging" className="text-xs flex-1 sm:flex-initial">staging</TabsTrigger>
            <TabsTrigger value="production" className="text-xs flex-1 sm:flex-initial">prod</TabsTrigger>
          </TabsList>

          {Object.entries(ENVS).map(([env, vars]) => (
            <TabsContent key={env} value={env} className="mt-3">
              <div className="space-y-1">
                {vars.map((v, i) => {
                  const isRevealed = revealed.has(i);
                  const showMasked = v.masked && !isRevealed;

                  return (
                    <div
                      key={v.key}
                      className="group flex items-center gap-2 rounded-lg px-2 py-2 font-mono text-[10px] sm:px-3 sm:py-2.5 sm:text-[11px] hover:bg-muted/40 transition-colors"
                    >
                      <span className="w-28 sm:w-44 shrink-0 font-medium text-foreground truncate">
                        {v.key}
                      </span>
                      <span className="text-muted-foreground/30 hidden sm:inline">=</span>
                      <span className="flex-1 truncate text-muted-foreground">
                        {showMasked ? '•'.repeat(16) : v.value}
                      </span>
                      {v.masked && (
                        <button
                          onClick={() => toggle(i)}
                          className="shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <HugeiconsIcon
                            icon={isRevealed ? ViewOffIcon : EyeIcon}
                            size={13}
                          />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
