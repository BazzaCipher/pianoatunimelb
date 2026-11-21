#!/usr/bin/env bash
# The k3s pod runs stock node:22-alpine against this folder's build/ (hostPath mount),
# so deploying is just: rebuild, then restart the pod. No image, no root.
set -euo pipefail
cd "$(dirname "$0")"

npm ci --no-audit --no-fund
npm run build
kubectl -n apps rollout restart deployment/pianoatunimelb
kubectl -n apps rollout status deployment/pianoatunimelb --timeout=120s
