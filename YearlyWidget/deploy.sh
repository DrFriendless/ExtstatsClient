#!/usr/bin/env bash

COMPONENT=YearlyWidget
mkdir -p ../../extstats-home/public/$COMPONENT
cp ./dist/browser/*.js ../../extstats-home/public/$COMPONENT/
cp ./dist/browser/*.js.map ../../extstats-home/public/$COMPONENT/
cp ./src/styles.css ../../extstats-home/public/$COMPONENT/
echo Files were copied to extstats-home.
date
