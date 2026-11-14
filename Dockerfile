# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN npm install -g pnpm@10.11.0 && apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --config.node-linker=hoisted

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Env vars are validated at runtime; the build doesn't have them.
ENV NEXT_TELEMETRY_DISABLED=1 SKIP_ENV_VALIDATION=true
RUN node_modules/.bin/next build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
