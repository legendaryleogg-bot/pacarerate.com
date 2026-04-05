#!/bin/bash
# Deploy only public files to Cloudflare Pages.
# Excludes: test-checklist.html, mockup-*.html, docs/, schema/, workers/

set -e

DIST="dist"
rm -rf "$DIST"
mkdir -p "$DIST"

# Copy public files
cp index.html "$DIST/"
cp privacy.html "$DIST/"
cp terms.html "$DIST/"
cp favicon.png "$DIST/"
cp favicon.svg "$DIST/"
cp og-image.png "$DIST/"
cp logo.png "$DIST/"
cp CNAME "$DIST/"
cp robots.txt "$DIST/"
cp sitemap.xml "$DIST/"
cp _headers "$DIST/"

# Copy directories
cp -r .well-known "$DIST/"
cp -r css "$DIST/"
cp -r js "$DIST/"
cp -r submit "$DIST/"
cp -r rates "$DIST/"

# Deploy
wrangler pages deploy "$DIST" --project-name pacarerate-com --branch main

# Clean up
rm -rf "$DIST"
echo "Deployed successfully"
