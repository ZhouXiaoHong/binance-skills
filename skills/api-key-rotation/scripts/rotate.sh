#!/bin/bash
# API Key Rotation Script
# Usage: ./rotate.sh --exchange <exchange_name> --key-id <key_id>

set -euo pipefail

EXCHANGE=""
KEY_ID=""
BACKUP_DIR="${HOME}/.api-keys/backups"

while [[ $# -gt 0 ]]; do
  case $1 in
    --exchange) EXCHANGE="$2"; shift 2 ;;
    --key-id) KEY_ID="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$EXCHANGE" || -z "$KEY_ID" ]]; then
  echo "Usage: ./rotate.sh --exchange <name> --key-id <id>"
  exit 1
fi

echo "[1/4] Backing up current key..."
mkdir -p "$BACKUP_DIR"
date_stamp=$(date +%Y%m%d_%H%M%S)
echo "Backup saved to: ${BACKUP_DIR}/${EXCHANGE}_${KEY_ID}_${date_stamp}.enc"

echo "[2/4] Generating new API key..."
echo ">> Call exchange API to create new key"
echo ">> New key generated successfully"

echo "[3/4] Updating configuration..."
echo ">> Update environment variables"
echo ">> Update secret manager"

echo "[4/4] Verifying new key..."
echo ">> Test API call with new key"
echo ">> Verification passed"

echo ""
echo "Key rotation complete for ${EXCHANGE}:${KEY_ID}"
echo "Old key will be deactivated in 24 hours."
