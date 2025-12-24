const successSound = document.getElementById("success-sound");
successSound.currentTime = 0;
successSound.play();

function launchConfetti() {
  import("https://cdn.skypack.dev/canvas-confetti").then(confetti => {
    confetti.default({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  });
}
launchConfetti();


const pages = document.querySelectorAll(".page");
let currentPage = 0;

const answers = [
  {
    solution: "gazapizm",
    error: "Aïe! failed.. try again. You can do it I'm sure!"
  },
  {
    solution: "kalben",
    error: "Ouchhhh, is your memory alright? Or is it mine? Hmmm... no, no, think again!"
  },
  {
    solution: "moby",
    error: "Hm, let's see if we can exchange tickets! 😂"
  }
];

pages.forEach((page, index) => {
  const button = page.querySelector("button");
  const input = page.querySelector("input");
  const error = page.querySelector(".error");

  if (!button) return;

  button.addEventListener("click", () => {
    const value = input.value.trim().toLowerCase();

    if (value === answers[index].solution) {
      pages[currentPage].classList.remove("active");
      currentPage++;
      pages[currentPage].classList.add("active");
    } else {
      error.textContent = answers[index].error;
    }
  });
});
