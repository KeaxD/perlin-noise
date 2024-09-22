import PerlinNoise from "./perlin.js";

const canvas = document.getElementById("perlinCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = window.innerHeight;

canvas.height = canvasSize;
canvas.width = canvasSize;

let noise = new PerlinNoise();

let noiseArr = [];

//Variables

let octaves = 6; // Number of layers
let persistence = 0.5; // Amplitude decrease factor
let total = 0;
let frequency = 1;
let zoomFactor = 300;
let amplitude = 1;

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

function Draw() {
  noiseArr = [];
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      let noiseValue = 0;
      total = 0;
      amplitude = 1; // Reset amplitude
      frequency = 1; // Reset frequency

      for (let o = 0; o < octaves; o++) {
        noiseValue +=
          noise.perlin(
            (x / zoomFactor) * frequency,
            (y / zoomFactor) * frequency
          ) * amplitude;

        total += amplitude;
        amplitude *= persistence; // Decrease amplitude
        frequency *= 2; // Increase frequency
      }

      // Normalize noise value
      const normalNoise = noiseValue / total;

      const color = Math.floor((normalNoise + 1) * 128); // Scale value to 0-255
      const colorMapping = noise.colorMapping(color);

      noiseArr.push(color);

      const index = (x + y * canvas.width) * 4;

      data[index] = colorMapping.r; // Red
      data[index + 1] = colorMapping.g; // Green
      data[index + 2] = colorMapping.b; // Blue
      data[index + 3] = 255; // Alpha
    }
  }
  ctx.putImageData(image, 0, 0);

  let result = findMinMax(noiseArr);

  console.log("Min :", result.min);
  console.log("Max :", result.max);
}

// Draw();
Draw();

function findMinMax(arr) {
  return arr.reduce(
    (acc, val) => {
      if (val > acc.max) acc.max = val;
      if (val < acc.min) acc.min = val;
      return acc;
    },
    { max: -Infinity, min: Infinity }
  );
}

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  if (event.key === "=") {
    zoomFactor += 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    Draw();
    console.log(`Zoom Factor: ${zoomFactor}`);
  }

  if (event.key === "-") {
    zoomFactor -= 10;
    zoomFactor = Math.max(zoomFactor, 90); // Ensure zoomFactor does not go below 30
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    Draw();
    console.log(`Zoom Factor: ${zoomFactor}`);
  }

  if (event.key === "o") {
    octaves += 1;
    if (octaves > 6) {
      octaves = 1;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    Draw();
    console.log(`Octaves: ${octaves}`);
  }

  if (event.key === "p") {
    // Press 'p' to increase persistence
    persistence += 0.1;
    if (persistence > 1) {
      persistence = 0.5; // Limit max value
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Draw();
    console.log(`Persistence: ${persistence}`);
  }
}
