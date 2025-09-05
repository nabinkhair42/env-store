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

## Data Migration

The application previously used plain text storage for environment variables. A migration was implemented to encrypt all existing data using AES-GCM encryption with key derivation based on user ID and project salt.

### Migration Process

The migration was performed using the following approach:

1. **Key Derivation**: Each project was assigned a unique salt (`userSalt`) for key derivation
2. **Encryption**: All existing plain text environment variables were encrypted using AES-GCM
3. **Database Update**: Projects were updated with encrypted variables and the new salt
4. **Backward Compatibility**: The system maintained support for both encrypted and plain text variables during the transition

### Migration Implementation

The migration service used the following components:

- **CryptoService**: Core encryption/decryption functionality using Web Crypto API
- **Key Derivation**: PBKDF2-based key derivation with user ID, AUTH_SECRET, and project salt
- **Data Format**: Encrypted data stored as objects with `ciphertext`, `iv`, and `authTag` fields
- **Error Handling**: Graceful fallback to original data if migration failed

### Migration Status

The migration has been completed and all existing data has been successfully encrypted. The migration service has been removed from the codebase as it is no longer needed.
