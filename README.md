# RustyLens

WASM‑powered image format converter with a dark/light theme toggle. Built with Next.js + Rust (via `wasm-bindgen`).

## Table of Contents
- [Features](#features)
- [Demo Flow](#demo-flow)
- [Getting Started](#getting-started)
- [Development Scripts](#development-scripts)
- [Architecture](#architecture)
- [WASM Module](#wasm-module)
- [Adding a New Image Format](#adding-a-new-image-format)
- [Theming](#theming)
- [Directory Structure](#directory-structure)
- [Performance Notes](#performance-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features
- Multi‑format conversion: PNG, JPEG, WEBP, BMP
- Client‑side processing via WebAssembly (no server upload)
- Theme toggle (auto detection + persistence in `localStorage`)
- Simple, extensible Rust conversion pipeline
- Minimal dependency footprint (`clsx` for class composition)

## Demo Flow
1. Start dev server (`pnpm dev`).
2. Open `http://localhost:3000`.
3. Select an image (any common raster format).
4. Choose output format from dropdown.
5. Click Convert → Download converted file.

## Getting Started
```bash
pnpm install
pnpm dev
# visit http://localhost:3000
```

To build for production:
```bash
pnpm build
pnpm start
```

## Development Scripts
| Script        | Purpose                     |
|---------------|-----------------------------|
| `pnpm dev`    | Run Next.js dev server      |
| `pnpm build`  | Production build            |
| `pnpm start`  | Start production server     |
| `pnpm lint`   | Run ESLint                  |
| `./build.sh`  | (If present) rebuild WASM   |

## Architecture
- **UI Layer (React / Next.js):** Handles file input, format selection, conversion triggering, download link creation.
- **State & Hooks:** `useWasm` encapsulates loading of the WASM bundle and exposes conversion functions.
- **WASM Layer (Rust):** Performs format decoding & encoding using the `image` crate.
- **Theming:** Controlled by a `<html class="dark">` token + CSS variables in `globals.css`.

## WASM Module
File: `wasm/src/lib.rs`

Exports (via `#[wasm_bindgen]`):
- `change_to_png(input: &[u8]) -> Vec<u8>`
- `change_to_jpeg(input: &[u8]) -> Vec<u8>`
- `change_to_webp(input: &[u8]) -> Vec<u8>`
- `change_to_bmp(input: &[u8]) -> Vec<u8>`
- Generic helper `change_format` for potential future dynamic dispatch.

Common conversion logic lives in a small helper `convert` wrapping `image::load_from_memory` and `DynamicImage::write_to`.

### Building / Updating WASM
If you modify Rust code you may need to re‑run a build step (depending on tooling setup, e.g. `wasm-pack build` integrated in `build.sh`). Ensure you have:
```bash
cargo install wasm-pack
./build.sh   # or manual invocation
```
The generated JS/WASM artifacts should be accessible to the Next.js app (often via `pkg/` or a custom copy step—adapt build script as needed).

## Adding a New Image Format
1. Confirm the `image` crate supports your target format.
2. Add a match arm in `change_format` or create a dedicated `change_to_xyz` function:
```rust
#[wasm_bindgen]
pub fn change_to_tiff(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Tiff)
}
```
3. Expose the new function in the hook (`useWasm`) and update the format dropdown in `page.tsx`.
4. Rebuild the WASM bundle.

## Theming
- Initialization script in `layout.tsx` decides initial theme: stored preference or system `prefers-color-scheme`.
- Toggle button flips `dark` state; we persist with `localStorage.setItem("theme", ...)`.
- CSS variables (`--bg`, `--fg`, etc.) defined for both light and dark, reducing per‑component styling needs.
- Form elements styled to respect theme variables (see `globals.css`).

## Directory Structure
```
app/
  components/ThemeToggleHeader.tsx   # Theme toggle header
  globals.css                        # CSS variables + base styles
  layout.tsx                         # Root layout + theme init script
  page.tsx                           # Main conversion UI
  src/hooks/useWasm.ts               # WASM loading hook
wasm/
  src/lib.rs                         # Rust conversion functions
```
Other config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, lock files.

## Performance Notes
- In‑memory conversion avoids network overhead; large images still depend on client CPU.
- Consider streaming / progressive enhancement for very large files (future).
- Revoke previous object URLs to prevent leaks (`URL.revokeObjectURL`).
- Potential optimization: resize before format conversion (add optional scaling step in Rust).

## Roadmap
- Add Open Graph / Twitter metadata & social preview image.
- Drag & drop area + batch conversions.
- Progress indicator & error handling for unsupported formats.
- Service worker for offline usage (manifest is present but minimal).
- Optional image transformations (resize, rotate, compress settings).

## Contributing
PRs welcome. Suggested workflow:
1. Fork & create feature branch.
2. Make changes with clear, conventional commits (e.g., `feat: add tiff support`).
3. Ensure build passes locally.
4. Submit PR with concise rationale.

## License
MIT – see `LICENSE`.
