#!/usr/bin/env bash
aws s3 sync staging/ s3://extstats-drfriendless-com --acl public-read
