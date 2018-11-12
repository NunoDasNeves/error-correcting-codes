#!/bin/sh

cd app
npm run build
cd ..
cat dist/index.html | sed -r 's/(interactive-algorithms\/)/\1dist\//g' > index.html
# hack for SPA-ness on github
mkdir -p encoder decoder pagerank
cp index.html encoder/
cp index.html decoder/
cp index.html pagerank/
