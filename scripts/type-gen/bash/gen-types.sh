#!/bin/bash


# Load environment variables from .env.local
set -o allexport
source .env.local
set +o allexport

if [ -z "$SUPABASE_PROJECT_REF" ]; then
  echo "Error: SUPABASE_PROJECT_REF is not set in .env.local"
  exit 1
fi


# Generate the Supabase types
pnpm supabase gen types typescript --project-id $SUPABASE_PROJECT_REF --schema public > models/supabase-types/supabase.ts

# Format the generated file with Prettier
pnpm prettier --write models/supabase-types/supabase.ts
