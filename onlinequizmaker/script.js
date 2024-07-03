document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();
});

function showCreateQuiz() {
    document.getElementById('createQuiz').classList.remove('hidden');
    document.getElementById('takeQuiz').classList.add('hidden');
}

function showTakeQuiz() {
    document.getElementById('createQuiz').classList.add('hidden');
    document.getElementById('takeQuiz').classList.remove('hidden');
}

function addQuestion() {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question';

    questionContainer.innerHTML = `
        <input type="text" placeholder="Question" required>
        <input type="text" placeholder="Choice 1" required>
        <input type="text" placeholder="Choice 2" required>
        <input type="text" placeholder="Choice 3" required>
        <input type="text" placeholder="Choice 4" required>
        <input type="text" placeholder="Correct Answer" required>
    `;

    document.getElementById('questionsContainer').appendChild(questionContainer);
}

document.getElementById('quizForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('quizTitle').value;
    const questions = Array.from(document.querySelectorAll('#questionsContainer .question')).map(questionDiv => {
        const inputs = questionDiv.querySelectorAll('input');
        return {
            question: inputs[0].value,
            choices: [inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value],
            correctAnswer: inputs[5].value
        };
    });

    const quiz = { title, questions };
    saveQuiz(quiz);
    alert('Quiz saved!');
    this.reset();
    document.getElementById('questionsContainer').innerHTML = '';
});

function saveQuiz(quiz) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    loadQuizzes();
}

function loadQuizzes() {
    const quizzesList = document.getElementById('quizzesList');
    quizzesList.innerHTML = '';

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizzes.forEach((quiz, index) => {
        const quizButton = document.createElement('button');
        quizButton.textContent = quiz.title;
        quizButton.onclick = () => startQuiz(index);
        quizzesList.appendChild(quizButton);
    });
}

function startQuiz(index) {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    const quiz = quizzes[index];

    quiz.questions.forEach((question, questionIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <p>${question.question}</p>
            ${question.choices.map((choice, choiceIndex) => `
                <label>
                    <input type="radio" name="question${questionIndex}" value="${choice}">
                    ${choice}
                </label>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.onclick = () => submitQuiz(index);
    quizContainer.appendChild(submitButton);

    quizContainer.classList.remove('hidden');
}

function submitQuiz(index) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes'));
    const quiz = quizzes[index];

    let score = 0;

    quiz.questions.forEach((question, questionIndex) => {
        const selected = document.querySelector(`input[name="question${questionIndex}"]:checked`);
        if (selected && selected.value === question.correctAnswer) {
            score++;
        }
    });

    alert(`You scored ${score} out of ${quiz.questions.length}`);
}
