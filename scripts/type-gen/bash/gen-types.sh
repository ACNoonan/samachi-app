#!/bin/bash

# Load environment variables from .env.local
set -o allexport
source .env.local
set +o allexport

# Generate the Supabase types
pnpm supabase gen types typescript --project-id $SUPABASE_PROJECT_REF --schema public > models/supabase-types/supabase.ts
