#!/usr/bin/env bash

cd ./wasm/ || exit
wasm-pack build --target web
rm -rf ../app/src/pkgs
cp -r ./pkg ../app/src/pkgs
cd .. || exit
