import Link from "next/link";
export default function CompressImage() {
  return (
    <Link
      href="/compressor"
      className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
    >
        Try Image Compressor
    </Link>
  );
}
