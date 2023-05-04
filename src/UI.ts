export default {
    resizeCanvas: () => {
        // change CSS properties to preserve aspect ratio while being centered
        const outputImage = document.getElementById("outputimage") as HTMLCanvasElement;
        outputImage.style.width = `calc(${outputImage.width} * min(100vh / ${outputImage.height}, 100vw / ${outputImage.width}))`;
        outputImage.style.height = `calc(${outputImage.height} * min(100vh / ${outputImage.height}, 100vw / ${outputImage.width}))`
    }
}