#!/bin/bash

file=$(echo $1 | sed -r 's/\.ts$//g')

if [[ "$file" == "$1" ]]; then
    echo "Error: $1 should have .ts extension";
    exit 1;
fi

tsc $1 --outFile out.js --target ES5 --lib es6,dom --noImplicitAny && node out.js

