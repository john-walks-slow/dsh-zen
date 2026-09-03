## DeepSeek Harness plugin development

Before changing plugin code, read https://dsh.pub/develop-plugin.md completely.
Follow the pinned runtime contract and verification boundaries there; this
repository's own security, testing, and release rules remain authoritative.

This project is a **Web UI + Host** plugin (bundle delivery track):

- Host face: `src/index.ts` → `lib/index.js` (empty `apply`, bundle row only)
- Web client: `src/client.ts` → `lib/client.js` (factory bundle via `window.__ModuleLoader__.load`)
- Activation: `cordis.patch.yml` inserts row `zen-tracker` → `dsh-zen-tracker`

## Commands

- `npm run build` — bundle client + host, deploy into the `web` profile node_modules
- `npm run typecheck` — `tsc --noEmit` against local shims in `src/dts-shim.d.ts`
- Deploy target is `$DSH_HOME/profiles/web/node_modules` (default `~/.dsh`); client-only
  changes need a page refresh, host-side changes need a DSH restart.

## Rules

- Commit `lib/` build artifacts (dsh.pub Git-distribution path requires committed runtime output).
- No machine-specific absolute paths in committed files.
- No git stash / checkout / restore / reset without user consent.
