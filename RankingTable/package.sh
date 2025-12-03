#!/usr/bin/env bash

rm ./dist/browser/*.js.map
npm run build
cp ./dist/browser/*.js ../../extstats-home/public/RankingTable/
cp ./dist/browser/*.js.map ../../extstats-home/public/RankingTable/
cp ./src/styles.css ../../extstats-home/public/RankingTable/
echo Files were copied to extstats-home.
