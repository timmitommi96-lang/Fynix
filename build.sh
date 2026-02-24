#!/bin/bash

echo "🔨 Building frontend..."
npm run build

echo "📦 Copying built files to backend..."
mkdir -p backend/public
cp -r dist/* backend/public/

echo "✅ Build complete! Run 'npm run backend:start' to deploy"
