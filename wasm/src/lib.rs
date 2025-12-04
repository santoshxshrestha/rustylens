use image::ImageFormat;
use num_complex;
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

#[wasm_bindgen]
pub fn generate_fractals(imgx: u32, imgy: u32) -> Vec<u8> {
    let scalex = 3.0 / imgx as f32;
    let scaley = 3.0 / imgy as f32;

    let mut imgbuf = image::ImageBuffer::new(imgx, imgy);

    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let r = (0.3 * x as f32) as u8;
        let b = (0.3 * y as f32) as u8;
        *pixel = image::Rgb([r, 0, b]);
    }

    for x in 0..imgx {
        for y in 0..imgy {
            let cx = y as f32 * scalex - 1.5;
            let cy = x as f32 * scaley - 1.5;

            let c = num_complex::Complex::new(-0.4, 0.6);
            let mut z = num_complex::Complex::new(cx, cy);

            let mut i = 0;
            while i < 255 && z.norm() <= 2.0 {
                z = z * z + c;
                i += 1;
            }

            let pixel = imgbuf.get_pixel_mut(x, y);
            let image::Rgb(data) = *pixel;
            *pixel = image::Rgb([data[0], i as u8, data[2]]);
        }
    }

    let mut output = Vec::new();
    imgbuf
        .write_to(&mut Cursor::new(&mut output), ImageFormat::Png)
        .expect("Failed to write image");
    output
}
