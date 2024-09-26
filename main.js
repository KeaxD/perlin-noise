import PerlinNoise from "./perlin.js";
import { Character } from "./character.js";

const canvas = document.getElementById("perlinCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = window.innerHeight;

canvas.height = canvasSize;
canvas.width = canvasSize;

let noise = new PerlinNoise();

//Variables

let octaves = 6; // Number of layers
let persistence = 0.5; // Amplitude decrease factor
let total = 0;
let frequency = 1;
let zoomFactor = 300;
let amplitude = 1;

let panOffsetX = 0; // Pan offset for X direction
let panOffsetY = 0; // Pan offset for Y direction

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

//Character variables
const characterX = 30;
const characterY = 30;
let characterRadius = 30;

let character = new Character(characterX, characterY);

function drawNoise() {
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      let noiseValue = 0;
      total = 0;
      amplitude = 1; // Reset amplitude
      frequency = 1; // Reset frequency

      for (let o = 0; o < octaves; o++) {
        noiseValue +=
          noise.perlin(
            ((x + panOffsetX) / zoomFactor) * frequency,
            ((y + panOffsetY) / zoomFactor) * frequency
          ) * amplitude;

        total += amplitude;
        amplitude *= persistence; // Decrease amplitude
        frequency *= 2; // Increase frequency
      }

      // Normalize noise value
      const normalNoise = noiseValue / total;

      const color = Math.floor((normalNoise + 1) * 128); // Scale value to 0-255
      const colorMapping = noise.colorMapping(color);

      const index = (x + y * canvas.width) * 4;

      data[index] = colorMapping.r; // Red
      data[index + 1] = colorMapping.g; // Green
      data[index + 2] = colorMapping.b; // Blue
      data[index + 3] = 255; // Alpha
    }
  }
  ctx.putImageData(image, 0, 0);
}

function Draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawNoise();
  character.update();
  character.Draw(ctx, zoomFactor / characterRadius);
  if (character.x != character.targetX) {
    drawX(character.targetX, character.targetY, 5);
  }
  requestAnimationFrame(Draw);
}

requestAnimationFrame(Draw);

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

  const panSpeed = 10; // Adjust the speed of panning

  //Map panning controls
  if (event.key === "ArrowLeft") {
    panOffsetX -= panSpeed;
    if (panOffsetX < 0) {
      panOffsetX = 0;
      console.log("Can't go out of bound");
    } else {
      console.log("Going Left");
      Draw();
    }
  }
  if (event.key === "ArrowRight") {
    panOffsetX += panSpeed;
    if (panOffsetX < 0) {
      panOffsetX = 0;
      console.log("Can't go out of bound");
    } else {
      console.log("Going Right");
      Draw();
    }
  }
  if (event.key === "ArrowUp") {
    panOffsetY -= panSpeed;
    if (panOffsetY < 0) {
      panOffsetY = 0;
      console.log("Can't go out of bound");
    } else {
      console.log("Going Up");
      Draw();
    }
  }
  if (event.key === "ArrowDown") {
    panOffsetY += panSpeed;
    if (panOffsetY < 0) {
      panOffsetY = 0;
      console.log("Can't go out of bound");
    } else {
      console.log("Going Down");
      Draw();
    }
  }
}

function drawX(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Set target position on click
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  character.setTarget(x, y);
  Draw();
});
