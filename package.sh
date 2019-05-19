#!/usr/bin/env bash

mkdir -p staging
rm -rf staging/*
cp -R src/img staging
cp -R src/json staging
cp src/*.txt staging
cp src/*.css staging
cp -R static/* staging
cd gatsby-site
npm run build
rm public/*.js
rm public/*.js.map
cp -R public/* ../staging
cd ..
