// Fix pour le bug 100vh sur mobile
function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialisation
setVhVariable();

// Recalculer uniquement lors du redimensionnement de la largeur
// (pas lors du scroll qui cache/affiche la barre d'adresse)
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    setVhVariable();
    lastWidth = window.innerWidth;
  }
});

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
      "✨ Aïe... is my memory actually wrong? No, no... think again! 💫"
    ]
  },
  {
    solution: "moby",
    errors: [
      "🎁 Hmm... Who do you REALLY want to see this summer? 😏",
      "🎉 Think about who makes the best summer vibes! ☀️",
      "🎊 Last chance! think about a bold guy with glasses 🎶"
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
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  script.onload = () => {
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
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.7 },
        colors: ['#667eea', '#764ba2', '#f093fb', '#64b5f6', '#ffd93d']
      });
    }, 250);
  };
  document.head.appendChild(script);
}

// Function to play Moby music
function playMobyMusic() {
  const mobyMusic = document.getElementById("moby-music");
  if (mobyMusic) {
    mobyMusic.volume = 0.5; // Volume à 50%
    mobyMusic.play().catch(err => {
      console.log("Music play failed (user interaction required):", err);
      // Fallback: créer un bouton si l'autoplay échoue
      createMusicButton();
    });
  }
}

// Créer un bouton de lecture si l'autoplay est bloqué
function createMusicButton() {
  const button = document.createElement('button');
  button.textContent = '🎵 Play Music';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: pulse 2s infinite;
  `;
  
  button.onclick = () => {
    const mobyMusic = document.getElementById("moby-music");
    if (mobyMusic) {
      mobyMusic.play();
      button.remove();
    }
  };
  
  document.body.appendChild(button);
}

// // Function to go to next page
// function goToNextPage() {
//   pages[currentPage].classList.remove("active");
//   currentPage++;

//   setTimeout(() => {
//     pages[currentPage].classList.add("active");
    
//     // Focus on input of new page
//     const nextInput = pages[currentPage].querySelector("input");
//     if (nextInput) {
//       setTimeout(() => nextInput.focus(), 100);
//     }

//     // Launch confetti on final page
//     if (currentPage === pages.length - 1) {
//       playSuccessSound();
//       launchConfetti();
//     }
//   }, 300);
// }

function goToNextPage() {
  pages[currentPage].classList.remove("active");
  currentPage++;

  setTimeout(() => {
    pages[currentPage].classList.add("active");

    // Launch confetti and music on final page
    if (currentPage === pages.length - 1) {
      playSuccessSound();
      launchConfetti();
      setTimeout(playMobyMusic, 1000); // Démarre la musique après 1 seconde
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
      e.preventDefault();
      checkAnswer();
    }
  });

  function checkAnswer() {
    const value = input.value.trim().toLowerCase();
    const correctAnswer = answers[index].solution.toLowerCase();

    if (value === correctAnswer) {
      // Correct answer
      errorElement.textContent = "";
      errorElement.style.display = "none";
      input.style.borderColor = "#4ade80";
      input.style.background = "#e8f5e9";
      input.disabled = true;
      button.disabled = true;

      playSuccessSound();

      setTimeout(() => {
        goToNextPage();
      }, 600);

    } else {
      // Wrong answer
      const errorMessages = answers[index].errors;
      errorElement.textContent = errorMessages[errorCount % errorMessages.length];
      errorElement.style.display = "block";
      errorCount++;

      // Shake animation
      input.classList.remove("shake");
      setTimeout(() => {
        input.classList.add("shake");
      }, 10);

      input.style.borderColor = "#ef5350";

      // Clear input after a moment
      setTimeout(() => {
        input.value = "";
        input.focus();
      }, 500);
    }
  }
});

// Initialize: focus on first input
window.addEventListener('load', () => {
  const firstInput = pages[0].querySelector('input');
  if (firstInput) {
    firstInput.focus();
  }
});
