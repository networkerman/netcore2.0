#!/bin/bash

# Check if the target directory exists
if [ ! -d "src" ]; then
    echo "Error: 'src' directory not found. Please make sure you're in the root of the repository."
    exit 1
fi

# Create necessary directories if they don't exist
mkdir -p src/lib/services
mkdir -p src/components

# Copy files to their respective locations
echo "Copying files..."

# Copy types.ts
cp types.ts src/lib/
echo "✓ Copied types.ts to src/lib/"

# Copy auto-reply.service.ts
cp auto-reply.service.ts src/lib/services/
echo "✓ Copied auto-reply.service.ts to src/lib/services/"

# Copy KeywordConfigManager.tsx
cp KeywordConfigManager.tsx src/components/
echo "✓ Copied KeywordConfigManager.tsx to src/components/"

# Copy README.md
cp README.md ../
echo "✓ Copied README.md to root directory"

echo "All files have been restored successfully!"
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Set up GitHub CLI: brew install gh"
echo "3. Authenticate with GitHub: gh auth login"
echo "4. Push changes: git push -u origin feature/integrate-uce2" 