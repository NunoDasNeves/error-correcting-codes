#!/bin/sh

tsc $1 --outFile out.js --target ES5;
node out.js

