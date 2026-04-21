'use client';

import { AvatarGroup } from '@/components/ui/avatar-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy01Icon,
  Download01Icon,
  EyeIcon,
  ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

const MOCK_PROJECTS = [
  {
    name: 'Production API',
    description: 'Backend service',
    members: [
      { name: 'Alex', image: 'https://i.pravatar.cc/150?u=alex' },
      { name: 'Sarah', image: 'https://i.pravatar.cc/150?u=sarah' },
      { name: 'James', image: 'https://i.pravatar.cc/150?u=james' },
    ],
  },
  {
    name: 'Mobile App',
    description: 'React Native',
    members: [
      { name: 'Priya', image: 'https://i.pravatar.cc/150?u=priya' },
      { name: 'Marcus', image: 'https://i.pravatar.cc/150?u=marcus' },
    ],
  },
  {
    name: 'Data Pipeline',
    description: 'ETL processing',
    members: [
      { name: 'Emma', image: 'https://i.pravatar.cc/150?u=emma' },
    ],
  },
];

const MOCK_VARIABLES = {
  development: [
    { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/myapp_dev' },
    { key: 'REDIS_URL', value: 'redis://localhost:6379' },
    { key: 'API_KEY', value: 'sk_test_4eC39HqLyjWDarj...' },
    { key: 'JWT_SECRET', value: 'dev-jwt-secret-key-here' },
  ],
  staging: [
    { key: 'DATABASE_URL', value: 'postgresql://staging.db:5432/myapp' },
    { key: 'REDIS_URL', value: 'redis://staging.cache:6379' },
    { key: 'API_KEY', value: 'sk_test_82M4yKjQ9r3nS8w...' },
  ],
  production: [
    { key: 'DATABASE_URL', value: 'postgresql://prod.db:5432/myapp' },
    { key: 'REDIS_URL', value: 'redis://prod.cache:6379' },
    { key: 'API_KEY', value: 'sk_live_51N3xKjH8q2mR7v...' },
    { key: 'JWT_SECRET', value: 'a7f3e2d1b9c8a5f4e3d2c1b...' },
    { key: 'SENTRY_DSN', value: 'https://abc123@sentry.io/456' },
  ],
};

export function HeroMock() {
  const [activeEnv, setActiveEnv] = useState('production');
  const [visibleIdx, setVisibleIdx] = useState<number | null>(null);
  const variables = MOCK_VARIABLES[activeEnv as keyof typeof MOCK_VARIABLES] ?? [];

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-left shadow-lg">
      {/* Dashboard mock */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Dashboard</span>
        <Badge variant="outline" className="text-[10px]">3 projects</Badge>
      </div>

      <div className="p-3 space-y-1.5 border-b">
        {MOCK_PROJECTS.map((p, i) => (
          <Item
            key={i}
            variant="outline"
            className={i === 0 ? 'ring-1 ring-primary/30 bg-muted/30' : 'opacity-60'}
          >
            <ItemContent>
              <ItemTitle className="text-xs">{p.name}</ItemTitle>
              <ItemDescription className="text-[10px]">{p.description}</ItemDescription>
            </ItemContent>
            <AvatarGroup items={p.members} max={3} size="sm" />
          </Item>
        ))}
      </div>

      {/* Editor mock */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">Production API</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {variables.length} variables · 3 environments
            </p>
          </div>
          <ButtonGroup>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled>
              <HugeiconsIcon icon={Copy01Icon} size={12} />
              Copy
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled>
              <HugeiconsIcon icon={Download01Icon} size={12} />
              Export
            </Button>
          </ButtonGroup>
        </div>

        <Tabs value={activeEnv} onValueChange={setActiveEnv}>
          <TabsList>
            <TabsTrigger value="development" className="text-xs">development</TabsTrigger>
            <TabsTrigger value="staging" className="text-xs">staging</TabsTrigger>
            <TabsTrigger value="production" className="text-xs">production</TabsTrigger>
          </TabsList>

          {Object.entries(MOCK_VARIABLES).map(([env, vars]) => (
            <TabsContent key={env} value={env} className="mt-3">
              <div className="space-y-1.5">
                {vars.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 font-mono text-[11px]"
                  >
                    <span className="shrink-0 font-medium text-foreground">{v.key}</span>
                    <span className="text-muted-foreground/40">=</span>
                    <span className="text-muted-foreground truncate flex-1">
                      {visibleIdx === i ? v.value : '•'.repeat(Math.min(v.value.length, 24))}
                    </span>
                    <button
                      onClick={() => setVisibleIdx(visibleIdx === i ? null : i)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon
                        icon={visibleIdx === i ? ViewOffIcon : EyeIcon}
                        size={12}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
