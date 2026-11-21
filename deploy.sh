#!/usr/bin/env bash
# Build me/pianos:latest straight into k3s' containerd on rauf, then restart the pod.
# Run as: sudo bash deploy.sh   (containerd/buildkit sockets are root-only)
set -euo pipefail
cd "$(dirname "$0")"

/home/barry/.local/bin/nerdctl --namespace k8s.io build -t me/pianos:latest .
k3s kubectl -n apps rollout restart deployment/pianoatunimelb
k3s kubectl -n apps rollout status deployment/pianoatunimelb --timeout=120s
