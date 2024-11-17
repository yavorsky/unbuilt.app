#!/bin/bash
# deploy.sh

# Update code
git pull origin main

# Install dependencies
yarn install

# Build packages
yarn turbo run build

# Restart app
pm2 restart ecosystem.config.js