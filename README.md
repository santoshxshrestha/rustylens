# RustyLens

Minimal WASM-powered image format converter with dark/light theme toggle.

## Features
- WASM image conversion (PNG, JPEG, WEBP, BMP)
- Theme toggle (persists preference via localStorage)
- Simple responsive UI
- Extensible Rust conversion pipeline

## Quick Start
```bash
pnpm install
pnpm dev
``` 
Visit http://localhost:3000 and upload an image, choose output format, click Convert, then download.

## Image Conversion
Rust code in `wasm/src/lib.rs` exposes functions compiled to WASM. The React hook (`app/src/hooks/useWasm.ts`) loads the module and provides converters.

## Theming
Dark mode applies via a `dark` class on `<html>` with CSS variables in `app/globals.css`. Preference auto-detected and stored in `localStorage`.

## Building WASM (optional)
If you change Rust code:
```bash
./build.sh
```
(Ensure you have `wasm-pack` installed.)

## Future Improvements
- Add Open Graph/Twitter metadata
- Add drag & drop and batch conversion

## License
MIT (see `LICENSE`).
