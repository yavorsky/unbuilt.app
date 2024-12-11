#!/bin/bash

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo "Redis not found. Installing Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install redis
        brew services start redis
    else
        # Linux
        sudo apt-get update
        sudo apt-get install redis-server
        sudo systemctl start redis
    fi
fi

# Check Redis connection
if redis-cli ping > /dev/null 2>&1; then
    echo "Redis is running"
else
    echo "Starting Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    else
        sudo systemctl start redis
    fi
fi

# Install dependencies
yarn install;

# Install playwright
yarn playwright install --with-deps;

# Start development server
npx next dev;
