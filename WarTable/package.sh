#!/usr/bin/env bash

rm ./dist/*.js.map
npm run build
cp ./dist/*.js ../../extstats-home/public/WarTable/
cp ./dist/*.js.map ../../extstats-home/public/WarTable/
cp ./src/styles.css ../../extstats-home/public/WarTable/
echo Files were copied to extstats-home.
