#!/bin/bash

# AFRICA WEATHER AI - Local Server Launcher
# This script starts a local web server to run the app

echo "🌍 AFRICA WEATHER AI - Server Launcher"
echo "======================================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Starting server with Python 3..."
    echo ""
    echo "📱 Open your browser to:"
    echo "   → http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Starting server with Python 2..."
    echo ""
    echo "📱 Open your browser to:"
    echo "   → http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✅ Starting server with Node.js..."
    echo ""
    echo "📱 Open your browser to:"
    echo "   → http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    npx http-server -p 8000
else
    echo "❌ Error: No web server found!"
    echo ""
    echo "Please install one of:"
    echo "  • Python 3: https://python.org"
    echo "  • Node.js: https://nodejs.org"
    echo ""
    exit 1
fi
