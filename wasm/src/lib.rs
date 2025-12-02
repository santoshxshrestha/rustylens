use std::io::Cursor;

use image::ImageFormat;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    log(&format!("Hello, {}!", name));
}
#[wasm_bindgen]
pub fn change_to_png(input: &[u8]) -> Vec<u8> {
    // Decode the input image
    let img = image::load_from_memory(input).expect("Failed to load image");

    // Create a buffer to store the PNG output
    let mut output = Vec::new();

    // Save the image as PNG into the buffer
    img.write_to(&mut Cursor::new(&mut output), ImageFormat::Png)
        .expect("Failed to write image as PNG");

    // Return the PNG image as a byte vector
    output
}
