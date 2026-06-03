#!/bin/bash

# Africa Weather AI - Local Setup Script

echo "🌍 Africa Weather AI - Setup"
echo "===================================="
echo ""

cd "$(dirname "$0")"

# Check Python availability
if command -v python3 &> /dev/null; then
    echo "✓ Python3 found"
    echo ""
    echo "🚀 Starting server on http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Python found"
    echo ""
    echo "🚀 Starting server on http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found"
    echo ""
    echo "Install Python 3 or use Node.js:"
    echo "  npx http-server"
    exit 1
fi
