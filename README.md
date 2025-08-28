<p align="center">
  <img src="public/logo.svg" alt="ENV Store logo" height="72">
</p>

# ENV Store

Save and recover your project’s environment variables, so you never lose them when machines die, folders get deleted, or repos get wiped.

## What it solves

`.env` files are fragile and siloed. If your project or device disappears, recreating all the keys is painful. ENV Store lets you keep project-scoped variables in one place and restore them in seconds—copy/paste or export a full `.env`.

## Live app

Use it here: https://envstore.nabinkhair.com.np

## Core features

- Project-scoped secret storage (`KEY=VALUE`)
- One-click copy for individual keys or full `.env` export
- Sign in with GitHub
- Works on any device with a browser

## How it works

1. Sign in with GitHub.
2. Create a project and add variables as `KEY=VALUE`.
3. When you need them again, copy single values or export a `.env` and paste into your codebase.

## Tech Stack:

 <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  </a>
<a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
  </a>
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm">
  </a>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
  </a>

## Security

Treat values as secrets. Avoid sharing accounts; rotate keys if exposed.
