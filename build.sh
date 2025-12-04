#!/usr/bin/env bash
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: ./build.sh [--release|clean|help]"
    echo ""
    echo "Options:"
    echo "  --release|-r|release   Build the WebAssembly package in release mode."
    echo "  --clean|-c|clean       Remove build artifacts."
    echo "  --help|-h|help         Display this help message."
    exit 0
fi

if [ "$1" = "clean" ] || [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    rm -rf ./app/src/pkgs
    rm -rf ./wasm/pkg
    echo "Cleaned build artifacts."
    exit 0
fi

if [ "$1" = "--release" ] || [ "$1" = "-r" ] || [ "$1" = "release" ]; then
    echo "Building in release mode..."
    BUILD_MODE="--release"
else
    echo "Building in debug mode..."
    BUILD_MODE=""
fi

cd ./wasm/ || exit
wasm-pack build $BUILD_MODE --target web
rm -rf ../app/src/pkgs
cp -r ./pkg ../app/src/pkgs
cd .. || exit
