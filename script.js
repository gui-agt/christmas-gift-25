// Configuration
const answers = [
  {
    solution: "gazapizm",
    errors: [
      "❄️ Oops! That's not it... Try again, you got this! 💪",
      "🎄 Hmm, not quite right... Think orchestra! 🎻",
      "⛄ Almost there! Give it another try! 🎶"
    ]
  },
  {
    solution: "kalben",
    errors: [
      "🎅 Ouch! Is your memory playing tricks? Think harder! 😅",
      "🌟 Not the right one... Remember our last concert? 🎤",
      "✨ Close but no cigar! You can do better! 💫"
    ]
  },
  {
    solution: "moby",
    errors: [
      "🎁 Hmm... Who do you REALLY want to see this summer? 😏",
      "🎉 Think about who makes the best summer vibes! ☀️",
      "🎊 Last chance! Who's your dream concert? 🎶"
    ]
  }
];

// Get all pages
const pages = document.querySelectorAll(".page");
let currentPage = 0;

// Function to play success sound
function playSuccessSound() {
  const successSound = document.getElementById("success-sound");
  if (successSound) {
    successSound.currentTime = 0;
    successSound.play().catch(err => console.log("Audio play failed:", err));
  }
}

// Function to launch confetti
function launchConfetti() {
  // Create canvas for confetti
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '998';
  document.body.appendChild(canvas);

  // Load and launch confetti
  import("https://cdn.skypack.dev/canvas-confetti").then(module => {
    const confetti = module.default;

    // Multiple confetti bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() * 0.6 }
      });
    }, 250);
  }).catch(err => console.log("Confetti failed:", err));
}

// Function to go to next page
function goToNextPage() {
  pages[currentPage].classList.remove("active");
  currentPage++;

  setTimeout(() => {
    pages[currentPage].classList.add("active");

    // Launch confetti on final page
    if (currentPage === pages.length - 1) {
      playSuccessSound();
      launchConfetti();
    }
  }, 300);
}

// Setup event listeners for each page
pages.forEach((page, index) => {
  const button = page.querySelector("button");
  const input = page.querySelector("input");
  const errorElement = page.querySelector(".error");

  if (!button || !input || index >= answers.length) return;

  let errorCount = 0;

  // Button click handler
  button.addEventListener("click", () => {
    checkAnswer();
  });

  // Enter key handler
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });

  function checkAnswer() {
    const value = input.value.trim().toLowerCase();
    const correctAnswer = answers[index].solution;

    if (value === correctAnswer) {
      // Correct answer
      errorElement.textContent = "";
      input.style.borderColor = "#4ade80";
      input.disabled = true;
      button.disabled = true;

      playSuccessSound();

      setTimeout(() => {
        goToNextPage();
      }, 500);

    } else {
      // Wrong answer
      const errorMessages = answers[index].errors;
      errorElement.textContent = errorMessages[errorCount % errorMessages.length];
      errorCount++;

      // Shake animation
      input.style.animation = "none";
      setTimeout(() => {
        input.style.animation = "shake 0.5s";
      }, 10);

      input.style.borderColor = "#ff6b9d";

      // Clear input
      input.value = "";
      input.focus();
    }
  }
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);
