#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCAL_ENV_FILE="$PROJECT_ROOT/.env.local"

# Check if .env.local exists and source it
if [ -f "$LOCAL_ENV_FILE" ]; then
    echo "Loading environment from $LOCAL_ENV_FILE"
    set -a
    source "$LOCAL_ENV_FILE"
    set +a
else
    echo "No .env.local found at $LOCAL_ENV_FILE"
fi

# Check if SUPABASE_ID is set
if [ -z "$SUPABASE_ID" ]; then
    echo "Error: SUPABASE_ID is not set"
    exit 1
fi

echo "Using SUPABASE_ID: $SUPABASE_ID"

# Remove existing types file
rm -f "$SCRIPT_DIR/../supabase/database.types.ts"

# Generate types
npx supabase gen types typescript \
    --project-id "$SUPABASE_ID" \
    --schema public \
    > "$SCRIPT_DIR/../supabase/database.types.ts"

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "Types generated successfully"
else
    echo "Error generating types"
    exit 1
fi
