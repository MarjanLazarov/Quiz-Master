let quizzes = [];
let selectedQuiz = null;
let timerInterval;
let timeLeft = 60;

const quizSelector = document.getElementById("quizSelector");
const quizContainer = document.getElementById("quizContainer");
const quizForm = document.getElementById("quizForm");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");
const timerDisplay = document.getElementById("timer");

// 1. Load quizzes on page load
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:5000/api/quizzes");// from here it pulls the quiz questions?
        quizzes = await res.json();
        populateQuizSelector();
    } catch (err) {
        quizSelector.innerHTML = `<option disabled>Error loading quizzes</option>`;
        console.error("Error fetching quizzes:", err)
    }
});

// 2. Populate dropdown
function populateQuizSelector() {
    quizSelector.innerHTML = `<option selected disabled>Select a quiz</option>`;
    quizzes.forEach((quiz, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = quiz.title;
        quizSelector.appendChild(option);
    });
}

// 3. Handle quiz selection
quizSelector.addEventListener("change", () => {
    const index = quizSelector.value;
    selectedQuiz = quizzes[index];
    renderQuiz();
    startTimer(60);
})

// 4. Render quiz form
function renderQuiz() {
    quizForm.innerHTML = "";
    result.classList.add("d-none");

    console.log("Selected Quiz:", selectedQuiz);
  
    selectedQuiz.questions.forEach((q, i) => {
      const card = document.createElement("div");
      card.className = "card my-3";
  
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
  
      const question = document.createElement("h5");
      question.textContent = `Q${i + 1}: ${q.text}`;
      cardBody.appendChild(question);
  
      q.options.forEach((opt, j) => {
        const option = document.createElement("div");
        option.className = "form-check";
  
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q${i}`;
        input.value = j;
        input.className = "form-check-input";
  
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.textContent = opt;
  
        option.appendChild(input);
        option.appendChild(label);
        cardBody.appendChild(option);
      });
  
      card.appendChild(cardBody);
      quizForm.appendChild(card);
    });
  
    quizContainer.classList.remove("d-none");
  }

// 5. Timer logic
function startTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            handleSubmit();
        }

    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// 6. Submit handler
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearInterval(timerInterval);
    handleSubmit();
});

function handleSubmit() {
    let score = 0;
    const total = selectedQuiz.questions.length;
    
    selectedQuiz.questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && parseInt(selected.value) === q.answer) {
            score++;
        }
    });

    result.textContent = `✅ You scored ${score} out of ${total}`;
    result.classList.remove("d-none");
}