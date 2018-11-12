#!/bin/sh

cd app
npm run build
cd ..
cat dist/index.html | sed -r 's/(interactive-algorithms\/)/\1dist\//g' > index.html
