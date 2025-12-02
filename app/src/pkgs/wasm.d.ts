/* tslint:disable */
/* eslint-disable */

export function change_format(input: Uint8Array, format: string): Uint8Array;

export function change_to_avif(input: Uint8Array): Uint8Array;

export function change_to_bmp(input: Uint8Array): Uint8Array;

export function change_to_hdr(input: Uint8Array): Uint8Array;

export function change_to_ico(input: Uint8Array): Uint8Array;

export function change_to_jpeg(input: Uint8Array): Uint8Array;

export function change_to_png(input: Uint8Array): Uint8Array;

export function change_to_webp(input: Uint8Array): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly change_format: (a: number, b: number, c: number, d: number) => [number, number];
  readonly change_to_avif: (a: number, b: number) => [number, number];
  readonly change_to_bmp: (a: number, b: number) => [number, number];
  readonly change_to_hdr: (a: number, b: number) => [number, number];
  readonly change_to_ico: (a: number, b: number) => [number, number];
  readonly change_to_jpeg: (a: number, b: number) => [number, number];
  readonly change_to_png: (a: number, b: number) => [number, number];
  readonly change_to_webp: (a: number, b: number) => [number, number];
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
