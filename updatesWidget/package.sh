#!/usr/bin/env bash

npm run buildprod
mkdir -p ../static/updatesWidget
cp ./dist/updatesWidget/*.js ../static/updatesWidget/
cp ./dist/updatesWidget/styles.css ../static/updatesWidget/styles.css
