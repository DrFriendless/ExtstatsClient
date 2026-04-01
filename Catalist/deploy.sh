#!/usr/bin/env bash

COMPONENT=Catalist
mkdir -p ../../extstats-home/public/$COMPONENT
cp ./dist/browser/*.js ../../extstats-home/public/$COMPONENT/
cp ./dist/browser/*.js.map ../../extstats-home/public/$COMPONENT/
cp ./src/styles.css ../../extstats-home/public/$COMPONENT/
echo Files were copied to extstats-home/$COMPONENT
date
