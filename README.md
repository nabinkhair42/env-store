# ENV Store

Save and recover your project's environment variables, so you never lose them when machines die, folders get deleted, or repos get wiped.

<div align="center">
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
  </div>

<p align="center">
  <img src="public/og.png" alt="ENV Store - Secure Environment Variable Management" width="600">
</p>

## What it solves

`.env` files are fragile and siloed. If your project or device disappears, recreating all the keys is painful. ENV Store lets you keep project-scoped variables in one place and restore them in seconds—copy/paste or export a full `.env`.

## Live app

Use it here: https://envstore.nabinkhair.com.np

## Core features

- Project-scoped secret storage (`KEY=VALUE`)
- End-to-end encryption for all environment variables
- One-click copy for individual keys or full `.env` export
- Sign in with GitHub
- Works on any device with a browser

## How it works

1. Sign in with GitHub.
2. Create a project and add variables as `KEY=VALUE`.
3. When you need them again, copy single values or export a `.env` and paste into your codebase.

## Security

All environment variables are encrypted using industry-standard encryption before being stored in the database. Your data is decrypted only when you access it through the authenticated interface. Treat values as secrets, avoid sharing accounts, and rotate keys if exposed.
