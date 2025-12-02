# RustyLens

WASM‑powered image format converter with a dark/light theme toggle. Built with Next.js + Rust (via `wasm-bindgen`).

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

| Script       | Purpose                   |
| ------------ | ------------------------- |
| `pnpm dev`   | Run Next.js dev server    |
| `pnpm build` | Production build          |
| `pnpm start` | Start production server   |
| `pnpm lint`  | Run ESLint                |
| `./build.sh` | (If present) rebuild WASM |

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

## License

MIT – see `LICENSE`.
