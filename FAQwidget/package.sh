#!/usr/bin/env bash

rm ./dist/browser/*.js.map
npm run build
cp ./dist/browser/*.js ../../extstats-home/public/FAQWidget/
cp ./dist/browser/*.js.map ../../extstats-home/public/FAQWidget/
cp ./src/styles.css ../../extstats-home/public/FAQWidget/
echo Files were copied to extstats-home.
