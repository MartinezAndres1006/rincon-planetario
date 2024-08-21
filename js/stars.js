// GLOBALS
const STAR_COLOR = "#fff";
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8;

// setup canvas
const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");
// aux variables
let scale = 1;
let width;
let height;
let stars = [];
let velocity = { x: 0.1, y: 0.1, z: 0.0005 };

// Functions
function generate() {
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: 0,
    y: 0,
    z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
  }));
}

function placeStar(star) {
  star.x = Math.random() * width;
  star.y = Math.random() * height;
}

function recycleStar(star) {
  let direction = "z";
  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
  if (direction === "z") {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  } else if (direction === "l") {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "r") {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "t") {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  } else if (direction === "b") {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }
}

function resize() {
  scale = window.devicePixelRatio || 1;
  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;
  stars.forEach(placeStar);
}

function step() {
  context.clearRect(0, 0, width, height);
  update();
  render();
  requestAnimationFrame(step);
}

function update() {
  stars.forEach((star) => {
    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += (star.x - width / 2) * velocity.z * star.z;
    star.y += (star.y - height / 2) * velocity.z * star.z;
    star.z += velocity.z;

    // Reciclamos cuando salga de los límites
    if (
      star.x < -OVERFLOW_THRESHOLD ||
      star.x > width + OVERFLOW_THRESHOLD ||
      star.y < -OVERFLOW_THRESHOLD ||
      star.y > height + OVERFLOW_THRESHOLD
    ) {
      recycleStar(star);
    }
  });
}

function render() {
  stars.forEach((star) => {
    context.beginPath();
    context.lineCap = "round";
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5 * Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo(star.x, star.y);

    let tailX = velocity.x * 2;
    let tailY = velocity.y * 2;

    // Evitamos que sea invisible
    if (Math.abs(tailX) < 0.1) tailX = 0.5;
    if (Math.abs(tailY) < 0.1) tailY = 0.5;

    context.lineTo(star.x + tailX, star.y + tailY);
    context.stroke();
  });
}

// listeners
generate();
resize();
step();

window.onresize = resize