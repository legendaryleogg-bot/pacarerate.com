#!/bin/bash
# Deploy only public files to Cloudflare Pages.
# Excludes: test-checklist.html, docs/, schema/, workers/, assets/favicon.png.png, assets/favicon.svg.svg

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
cp CNAME "$DIST/"
cp robots.txt "$DIST/"
cp sitemap.xml "$DIST/"

# Copy directories
cp -r css "$DIST/"
cp -r js "$DIST/"
cp -r submit "$DIST/"
cp -r rates "$DIST/"

# Copy only the GeoJSON from assets (not the double-extension originals)
mkdir -p "$DIST/assets"
cp assets/pa-counties.geojson "$DIST/assets/"

# Deploy
wrangler pages deploy "$DIST" --project-name pacarerate-com --branch main

# Clean up
rm -rf "$DIST"
echo "Deployed successfully"
