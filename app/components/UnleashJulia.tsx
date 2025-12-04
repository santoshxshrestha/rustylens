export default function UnleashJulia({generate_fractals}: {generate_fractals: () => Uint8Array}) {
    const handleClick = () => {
        const fractalBytes = generate_fractals();
        const bytes = fractalBytes.slice();
        const blob = new Blob([bytes.buffer], { type: "image/png" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "fractal.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
            <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
                Unleash Julia's Power!
            </button>

    )
}
