type handleConversionArgs = {
  file: File;
  format: string;
  ready: boolean;
  convertFn: (input: Uint8Array) => Uint8Array;
  downloadUrl: string;
  setDownloadUrl: (url: string) => void;
};

export const handleConversion = async ({
  file,
  format,
  ready,
  convertFn,
  downloadUrl,
  setDownloadUrl,
}: handleConversionArgs) => {
  if (!ready) return;

  console.log("WASM is ready, starting conversion...");

  const inputBytes = new Uint8Array(await file.arrayBuffer());
  const outBytes = convertFn(inputBytes);

  const resolvedFormat = (format === "jpg" ? "jpeg" : format).toLowerCase();
  const mime: string = (() => {
    switch (resolvedFormat) {
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "bmp":
        return "image/bmp";
      case "avif":
        return "image/avif";
      case "hdr":
        return "image/vnd.radiance";
      case "ico":
        return "image/x-icon";
      default:
        return "application/octet-stream";
    }
  })();

  const bytes = outBytes.slice();
  const blob = new Blob([bytes.buffer], { type: mime });

  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);

  return () => {
    URL.revokeObjectURL(url);
  };
};
