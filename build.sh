#!/bin/bash
git submodule update --init --recursive --remote
mkdir -pv public/
cp -rv exp_util/* public/
rsync -av --include='*/' --include='*.png' --include='*.jpg' --exclude="*" ./content/ ./public
emacs -Q --script build-site.el
