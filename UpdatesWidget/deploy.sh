#!/usr/bin/env bash

cp ./dist/browser/*.js ../../extstats-home/public/UpdatesWidget/
cp ./dist/browser/*.js.map ../../extstats-home/public/UpdatesWidget/
cp ./src/styles.css ../../extstats-home/public/UpdatesWidget/
echo Files were copied to extstats-home.
