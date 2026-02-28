# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue Vben Admin is a Vue 3 + Vite + TypeScript monorepo admin template. The project uses pnpm as package manager and turbo for build orchestration.

## Common Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                  # Run all dev servers
pnpm dev:play            # Run playground (main dev app) only
pnpm dev:mock            # Run backend-mock server only

# Build
pnpm build               # Build all apps
pnpm build:play          # Build playground only
pnpm build:antd          # Build antd variant

# Linting & Checking
pnpm lint                # Run lint
pnpm format              # Format code
pnpm check               # Run all checks (type, dep, circular)
pnpm check:type          # TypeScript check only

# Testing
pnpm test:unit           # Run unit tests
pnpm test:e2e            # Run e2e tests
```

## Project Structure

```
vue-vben-admin/
├── apps/                    # Applications
│   ├── playground/          # Main development app (VbenAdmin)
│   ├── backend-mock/       # Nitro-based mock server (port 5320)
│   ├── web-antd/           # Ant Design variant
│   ├── web-naive/          # Naive UI variant
│   └── ...
├── packages/               # Core packages
│   ├── @core/             # Core functionality
│   ├── locales/           # i18n
│   ├── stores/            # Pinia stores
│   ├── styles/           # Global styles
│   └── ...
└── playground/            # Main app source (symlink to apps/playground)
```

## Development Notes

- The main frontend app is in `playground/src/` (symlinked to `apps/playground`)
- Mock API server runs on port 5320, serves files from `apps/backend-mock/api/`
- Mock API routes follow Nitro's file-based routing: `api/[path]/[method].ts` or `api/[path]/[...].ts`
- Frontend API calls are defined in `playground/src/api/`
- Language files: `playground/src/locales/langs/{zh-CN,en-US}/*.json`

## Constraints

- **Never delete or rename files autonomously** when changing API paths. If the API path and filename don't match, create a new file at the new path instead of deleting or renaming the old one. This preserves the old file in case it's needed elsewhere.

## Architecture

- **Monorepo**: Uses pnpm workspaces + turbo
- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Frameworks**: Supports Antd, NaiveUI, Element Plus, TDesign
- **Mock**: Nitro server (h3) with file-based routing
- **State**: Pinia stores
- **i18n**: Custom solution with JSON locale files
