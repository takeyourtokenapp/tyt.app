#!/bin/bash

# Script to automatically fix theme colors in TSX files

echo "🎨 Starting theme color fixes..."

# Find all TSX files in src directory
find src -name "*.tsx" -type f | while read file; do
  # Skip if file doesn't contain gray colors
  if ! grep -q "gray-[789]00\|text-gray-[234]00\|border-gray-[67]00\|text-white " "$file"; then
    continue
  fi

  echo "Fixing: $file"

  # Create backup
  cp "$file" "$file.bak"

  # Replace background colors
  sed -i 's/bg-gray-900\([^/]\)/bg-primary\1/g' "$file"
  sed -i 's/bg-gray-800\([^/]\)/bg-secondary\1/g' "$file"
  sed -i 's/bg-gray-700\([^/]\)/bg-tertiary\1/g' "$file"

  # Replace gradient backgrounds
  sed -i 's/from-gray-900/from-primary/g' "$file"
  sed -i 's/to-gray-900/to-primary/g' "$file"
  sed -i 's/via-gray-900/via-primary/g' "$file"
  sed -i 's/from-gray-800/from-secondary/g' "$file"
  sed -i 's/to-gray-800/to-secondary/g' "$file"
  sed -i 's/via-gray-800/via-secondary/g' "$file"
  sed -i 's/from-gray-700/from-tertiary/g' "$file"
  sed -i 's/to-gray-700/to-tertiary/g' "$file"

  # Replace text colors
  sed -i 's/text-gray-400\([^/]\)/text-tertiary-text\1/g' "$file"
  sed -i 's/text-gray-300\([^/]\)/text-secondary-text\1/g' "$file"
  sed -i 's/text-gray-200\([^/]\)/text-primary-text\1/g' "$file"

  # Replace border colors
  sed -i 's/border-gray-700\([^/]\)/border-secondary\1/g' "$file"
  sed -i 's/border-gray-600\([^/]\)/border-secondary\1/g' "$file"

  # Check if changes were made
  if ! cmp -s "$file" "$file.bak"; then
    echo "✅ Fixed: $file"
    rm "$file.bak"
  else
    # No changes, restore backup
    mv "$file.bak" "$file"
  fi
done

echo "✅ Theme color fixes complete!"
