<meta name='viewport' content='width=device-width, initial-scale=1'/>// 🚗 Traffic Racing Game (Balanced Mode)
// By Samir Thapa

const car = document.getElementById("car");
const road = document.getElementById("road");
let position = 150;
let score = 0;

// Car movement
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && position > 0) {
    position -= 20;
  } else if (event.key === "ArrowRight" && position < 280) {
    position += 20;
  }
  car.style.left = position + "px";
});

// Create obstacles
function createObstacle() {
  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.style.left = Math.floor(Math.random() * 3) * 100 + "px"; // 3 lanes
  road.appendChild(obs);

  let top = -100;
  const fall = setInterval(() => {
    top += 5; // slower fall for better balance
    obs.style.top = top + "px";

    // Collision detection
    const carRect = car.getBoundingClientRect();
    const obsRect = obs.getBoundingClientRect();

    if (
      obsRect.top + obsRect.height >= carRect.top &&
      obsRect.left < carRect.left + carRect.width &&
      obsRect.left + obsRect.width > carRect.left
    ) {
      clearInterval(fall);
      alert("💥 Crash! Final Score: " + score);
      window.location.reload();
    }

    // Remove obstacle if off screen
    if (top > 600) {
      clearInterval(fall);
      obs.remove();
      score++;
      document.getElementById("score").innerText = "Score: " + score;
    }
  }, 30);
}

// Spawn obstacles at slower intervals
setInterval(createObstacle, 1500);
