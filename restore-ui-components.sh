#!/bin/bash

# Script to restore UI components from backup folder
if [ ! -d "backup-ui" ]; then
  echo "Error: backup-ui folder not found. Did you run backup-ui-components.sh first?"
  exit 1
fi

echo "Restoring UI components from backup folder..."

# Restore UI component directories
cp -r backup-ui/components app/ 2>/dev/null || true

# Restore page components
cp -r backup-ui/profile app/ 2>/dev/null || true
cp -r backup-ui/venue app/ 2>/dev/null || true
cp -r backup-ui/wallet app/ 2>/dev/null || true
cp -r backup-ui/login app/ 2>/dev/null || true
cp -r backup-ui/create-profile app/ 2>/dev/null || true
cp -r backup-ui/dashboard app/ 2>/dev/null || true
cp -r backup-ui/discover app/ 2>/dev/null || true
cp -r backup-ui/card app/ 2>/dev/null || true

# Restore UI-specific files
cp backup-ui/providers.tsx app/ 2>/dev/null || true
cp backup-ui/globals.css app/ 2>/dev/null || true

echo "UI components restored from backup"
echo "Note: These are not tracked by git while on the backend-only branch" 