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
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-red-400/80" />
          <div className="size-2.5 rounded-full bg-yellow-400/80" />
          <div className="size-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[11px] text-muted-foreground/60 font-mono">
            envstore.nabinkhair.com.np/dashboard/prod-api
          </span>
        </div>
      </div>

      {/* Project header */}
      <div className="flex items-start justify-between border-b px-5 py-4">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Production API</h3>
              <Badge variant="outline" className="text-[10px]">
                {variables.length} vars
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Backend API service · 3 environments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AvatarGroup items={MEMBERS} max={3} size="sm" />
          <ButtonGroup>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <HugeiconsIcon icon={Copy01Icon} size={12} />
              Copy
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <HugeiconsIcon icon={Download01Icon} size={12} />
              Export
            </Button>
            <Button size="sm" className="h-7 text-xs">
              <HugeiconsIcon icon={SaveIcon} size={12} />
              Save
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Environment tabs + variables */}
      <div className="px-5 pt-4 pb-5">
        <Tabs value={activeEnv} onValueChange={resetOnTabChange}>
          <TabsList>
            <TabsTrigger value="development" className="text-xs">development</TabsTrigger>
            <TabsTrigger value="staging" className="text-xs">staging</TabsTrigger>
            <TabsTrigger value="production" className="text-xs">production</TabsTrigger>
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
                      className="group flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-[11px] hover:bg-muted/40 transition-colors"
                    >
                      <span className="w-44 shrink-0 font-medium text-foreground truncate">
                        {v.key}
                      </span>
                      <span className="text-muted-foreground/30">=</span>
                      <span className="flex-1 truncate text-muted-foreground">
                        {showMasked ? '•'.repeat(20) : v.value}
                      </span>
                      {v.masked && (
                        <button
                          onClick={() => toggle(i)}
                          className="shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
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
