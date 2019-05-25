#!/usr/bin/env bash

mkdir -p staging
rm -rf staging/*
cp -R src/* staging
cp -R static/* staging
cd gatsby
npm run build
rm public/*.js
rm public/*.js.map
cp -R public/* ../staging
cd ..
