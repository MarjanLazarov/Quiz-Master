const API_URL = 'http://localhost:5000/api/quizzes';

document.getElementById('quizForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('quizTitle').value;
    const questions = Array.from(document.querySelectorAll('.question-block')).map(block => {
        const question = block.querySelector('.question-text').value;
        const options = Array.from(block.querySelectorAll('.option')).map(o => o.value);
        const correctAnswer = parseInt(block.querySelector('.correct-answer').value);
        return { question, options, correctAnswer };
    });

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, questions}),
    });

    if(response.ok) {
        alert('Quiz saved!');
        document.getElementById('quizForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        loadQuizzes();
    } else {
        alert('Error saving quiz');
    }
});

function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const index = container.children.length;

    const html = `
    <div class="question-block border p-3 mb-3">
      <label>Question:</label>
      <input type="text" class="form-control mb-2 question-text" required />

      <label>Options:</label>
      <div class="row g-2 mb-2">
        ${[0, 1, 2, 3].map(i => `
          <div class="col-6">
            <input type="text" class="form-control option" placeholder="Option ${i + 1}" required />
          </div>
        `).join('')}
      </div>

      <label>Correct Answer (0-3):</label>
      <input type="number" class="form-control correct-answer" min="0" max="3" required />
    </div>
  `;

  container.insertAdjacentHTML('beforeend', html);
}

async function loadQuizzes() {
    const res = await fetch(API_URL);
    const quizzes = await res.json();
    const list = document.getElementById('quizList');
    list.innerHTML = '';

    quizzes.forEach(quiz => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
      <span>${quiz.title}</span>
      <div>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteQuiz('${quiz._id}')">Delete</button>
      </div>
    `;
    list.appendChild(li);
    });
}

async function deleteQuiz(id) {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadQuizzes();
      } else {
        alert('Error deleting quiz');
      }
    }
  }

// Initial load
loadQuizzes();