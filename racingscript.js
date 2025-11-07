<meta name='viewport' content='width=device-width, initial-scale=1'/>const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

let lanes = [50, 125, 200];
let player = { x: lanes[1], y: 420, lane: 1, w: 40, h: 70 };
let enemies = [];
let speed = 3;
let score = 0;
let highScore = localStorage.getItem('racer-high') || 0;
let running = true;
let paused = false;
let lastTime = 0;

const scoreEl = document.getElementById('score');
const highEl = document.getElementById('high');
const btnRestart = document.getElementById('btn-restart');
const btnPause = document.getElementById('btn-pause');
const btnMute = document.getElementById('btn-mute');
const touchLeft = document.getElementById('btn-left');
const touchRight = document.getElementById('btn-right');

let muted = false;

// Draw player
function drawPlayer() {
  ctx.fillStyle = "#00C2A0";
  ctx.fillRect(player.x - player.w / 2, player.y, player.w, player.h);
}

// Draw enemies
function drawEnemy(e) {
  ctx.fillStyle = e.color;
  ctx.fillRect(e.x - e.w / 2, e.y, e.w, e.h);
}

// Reset game
function reset() {
  enemies = [];
  score = 0;
  speed = 3;
  player.lane = 1;
  player.x = lanes[player.lane];
  running = true;
  lastTime = performance.now();
  requestAnimationFrame(update);
}

// Spawn enemies -- controlled spacing
function spawnEnemy() {
  if (enemies.length === 0 || enemies[enemies.length - 1].y > 180) {
    const lane = Math.floor(Math.random() * 3);
    const color = Math.random() > 0.5 ? "#FF595E" : "#FFCA3A";
    enemies.push({ x: lanes[lane], y: -80, w: 40, h: 70, color });
  }
}

// Update game
function update(time) {
  if (!running || paused) return;
  const delta = time - lastTime;
  lastTime = time;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnEnemy();

  // Move enemies
  for (let e of enemies) e.y += speed;
  enemies = enemies.filter(e => e.y < canvas.height + 50);

  // Collision check
  for (let e of enemies) {
    if (
      Math.abs(e.x - player.x) < 40 &&
      e.y + e.h > player.y &&
      e.y < player.y + player.h
    ) {
      endGame();
      return;
    }
  }

  // Score update
  score += delta * 0.02;
  updateHUD();

  // Slightly increase speed over time
  speed += 0.0005 * delta;

  // Draw
  for (let e of enemies) drawEnemy(e);
  drawPlayer();

  requestAnimationFrame(update);
}

// Move player to lane
function movePlayerToLane(l) {
  player.lane = Math.max(0, Math.min(2, l));
  player.x = lanes[player.lane];
}

window.addEventListener("keydown", (ev) => {
  if (ev.key === "ArrowLeft") movePlayerToLane(player.lane - 1);
  if (ev.key === "ArrowRight") movePlayerToLane(player.lane + 1);
  if (ev.key === " ") togglePause();
});

btnRestart.addEventListener("click", () => reset());
btnPause.addEventListener("click", togglePause);
btnMute.addEventListener("click", () => {
  muted = !muted;
  btnMute.textContent = muted ? "Unmute" : "Mute";
});

touchLeft.addEventListener("touchstart", (e) => {
  e.preventDefault();
  movePlayerToLane(player.lane - 1);
});
touchRight.addEventListener("touchstart", (e) => {
  e.preventDefault();
  movePlayerToLane(player.lane + 1);
});

// Pause toggle
function togglePause() {
  paused = !paused;
  btnPause.textContent = paused ? "Resume" : "Pause";
  if (!paused && running) {
    lastTime = performance.now();
    requestAnimationFrame(update);
  }
}

// End game
function endGame() {
  running = false;
  setTimeout(() => {
    alert(`💥 Game Over!\nScore: ${Math.floor(score)}\nHigh: ${Math.floor(highScore)}`);
    if (score > highScore) {
      localStorage.setItem("racer-high", Math.floor(score));
      highScore = Math.floor(score);
    }
    updateHUD();
  }, 200);
}

// HUD update
function updateHUD() {
  scoreEl.textContent = Math.floor(score);
  highEl.textContent = Math.floor(highScore);
}

lastTime = performance.now();
requestAnimationFrame(update);
