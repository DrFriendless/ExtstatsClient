#!/usr/bin/env bash

COMPONENT=FavouritesWidget
cp ./dist/browser/*.js ../../extstats-home/public/$COMPONENT/
cp ./dist/browser/*.js.map ../../extstats-home/public/$COMPONENT/
cp ./src/styles.css ../../extstats-home/public/$COMPONENT/
echo Files were copied to extstats-home/$COMPONENT
date
