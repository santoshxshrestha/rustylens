use image::ImageFormat;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

fn convert(input: &[u8], format: ImageFormat) -> Vec<u8> {
    let img = image::load_from_memory(input).expect("Failed to load image");
    let mut output = Vec::new();
    img.write_to(&mut Cursor::new(&mut output), format)
        .expect("Failed to write image");
    output
}

#[wasm_bindgen]
pub fn change_format(input: &[u8], format: &str) -> Vec<u8> {
    match format.to_lowercase().as_str() {
        "png" => convert(input, ImageFormat::Png),
        "jpeg" | "jpg" => convert(input, ImageFormat::Jpeg),
        "webp" => convert(input, ImageFormat::WebP),
        "bmp" => convert(input, ImageFormat::Bmp),
        "avif" => convert(input, ImageFormat::Avif),
        "hdr" => convert(input, ImageFormat::Hdr),
        "ico" => convert(input, ImageFormat::Ico),
        _ => convert(input, ImageFormat::Png),
    }
}

#[wasm_bindgen]
pub fn change_to_png(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Png)
}

#[wasm_bindgen]
pub fn change_to_jpeg(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Jpeg)
}

#[wasm_bindgen]
pub fn change_to_webp(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::WebP)
}

#[wasm_bindgen]
pub fn change_to_bmp(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Bmp)
}
#[wasm_bindgen]
pub fn change_to_avif(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Avif)
}

#[wasm_bindgen]
pub fn change_to_hdr(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Hdr)
}

#[wasm_bindgen]
pub fn change_to_ico(input: &[u8]) -> Vec<u8> {
    convert(input, ImageFormat::Ico)
}
