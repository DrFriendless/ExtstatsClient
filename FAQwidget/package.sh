#!/usr/bin/env bash

npm run build
cp ./dist/*.js ../../extstats-home/public/FAQWidget/
cp ./src/styles.css ../../extstats-home/public/FAQWidget/
echo Files were copied to extstats-home.
