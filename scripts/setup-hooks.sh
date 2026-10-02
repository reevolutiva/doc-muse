#!/bin/sh
# Activa los hooks versionados del repositorio (.githooks) sin pisar una
# configuración previa del usuario. Se ejecuta desde `pnpm install` (prepare)
# y también de forma manual con `pnpm run setup:hooks`.
set -eu

command -v git >/dev/null 2>&1 || exit 0
[ -d .git ] || exit 0

current=$(git config --get core.hooksPath || true)

if [ -n "$current" ] && [ "$current" != ".githooks" ]; then
  echo "core.hooksPath ya está configurado en '$current': no se modifica. Integra .githooks/pre-commit manualmente." >&2
  exit 0
fi

git config core.hooksPath .githooks
echo "Hooks activados: core.hooksPath=.githooks (requiere Gitleaks instalado; ver README.md)."
