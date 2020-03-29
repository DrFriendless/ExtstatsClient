#!/usr/bin/env bash

NAME=yearlyWidget
npm run buildprod
mkdir -p ../static/$NAME
cp ./dist/$NAME/*.js ../static/$NAME/
cp ./dist/$NAME/styles.css ../static/$NAME/styles.css
