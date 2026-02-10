#!/usr/bin/env bash

COMPONENT=WarTable
DEST=../../extstats-home/public/$COMPONENT
cp ./dist/browser/*.js $DEST
cp ./dist/browser/*.js.map $DEST
cp ./src/styles.css $DEST
echo Files were copied to $DEST
