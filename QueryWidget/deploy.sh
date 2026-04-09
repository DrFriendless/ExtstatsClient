#!/usr/bin/env bash

COMPONENT=QueryWidget
DEST=../../extstats-home/public/$COMPONENT
mkdir -p $DEST
cp ./dist/browser/*.js $DEST
cp ./dist/browser/*.js.map $DEST
cp ./src/styles.css $DEST
echo Files were copied to $DEST
date
