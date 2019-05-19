#! /bin/sh

npm run-script build && webpack --config webpack.config.js --mode=production && cp dist/login.* ../static