#!/bin/bash
# Setup script for La Internacional CRM development environment

set -e

echo "=========================================="
echo "La Internacional CRM - Setup Script"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

echo "✓ Docker found"

# Create .env.local if doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✓ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Meta credentials:"
    echo "   - META_APP_ID"
    echo "   - META_ACCESS_TOKEN"
    echo "   - META_PHONE_NUMBER_ID"
    echo "   - META_BUSINESS_ACCOUNT_ID"
    echo "   - META_VERIFY_TOKEN"
    echo ""
    echo "Get these from: https://developers.facebook.com"
    echo ""
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "Building Docker images..."
docker-compose build

echo ""
echo "=========================================="
echo "✓ Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your Meta credentials"
echo "  2. Run: docker-compose up"
echo "  3. Access frontend: http://localhost:5173"
echo "  4. Access API: http://localhost:8080"
echo ""
