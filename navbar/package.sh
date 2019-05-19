#! /bin/sh

npm run-script build && webpack --config webpack.config.js && cp dist/navbar.* ../static