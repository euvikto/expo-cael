const quizQuestions = [
  { question: "Qual foi o primeiro país a sediar uma Copa do Mundo?", options: ["Uruguai","Brasil","Itália","França"], correct: 0 },
  { question: "Qual jogador detém o recorde de mais gols em Copas do Mundo?", options: ["Pelé","Miroslav Klose","Ronaldo","Gerd Müller"], correct: 1 },
  { question: "Em que ano a Copa do Mundo foi realizada pela primeira vez no continente africano?", options: ["2006","2010","2014","2018"], correct: 1 },
  { question: "Qual seleção venceu a Copa do Mundo de 1998?", options: ["Brasil","Alemanha","França","Itália"], correct: 2 },
  { question: "Quantas vezes a Itália venceu a Copa do Mundo?", options: ["2","3","4","5"], correct: 2 },
  { question: "Qual país já ganhou mais Copas do Mundo?", options: ["Alemanha","Argentina","Brasil","Itália"], correct: 2 },
  { question: "Quem foi o artilheiro da Copa do Mundo de 2014?", options: ["Thomas Müller","Lionel Messi","James Rodríguez","Neymar"], correct: 2 },
  { question: "De quantos em quantos anos acontece a Copa do Mundo?", options: ["2","3","4","5"], correct: 2 },
  { question: "Qual seleção foi campeã da Copa do Mundo de 2018?", options: ["Argentina","Croácia","Alemanha","França"], correct: 3 },
  { question: "Qual seleção foi a campeã da primeira Copa do Mundo?", options: ["Uruguai","Argentina","Brasil","Itália"], correct: 0 },
  { question: "Quantos gols Pelé marcou em Copas do Mundo?", options: ["10","12","14","16"], correct: 1 },
  { question: "Qual jogador argentino foi o destaque da Copa de 2022?", options: ["Di María","Dybala","Messi","Martínez"], correct: 2 },
  { question: "Quem foi o goleiro que mais vezes defendeu pênaltis em Copas do Mundo?", options: ["Gianluigi Buffon","Iker Casillas","Manuel Neuer","Jan Jongbloed"], correct: 3 },
  { question: "Qual país sediou a Copa do Mundo de 2002 junto com o Japão?", options: ["China","Coreia do Sul","Austrália","Tailândia"], correct: 1 },
  { question: "Em que país aconteceu a Copa do Mundo de 2022?", options: ["Rússia","Inglaterra","França","Catar"], correct: 3 }
];

// DOM
const startQuizBtn = document.getElementById('start-quiz');
const nextQuestionBtn = document.getElementById('next-question');
const submitQuizBtn = document.getElementById('submit-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('timer');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const welcomeScreen = document.querySelector('.welcome-screen');
const quizScreen = document.querySelector('.quiz-screen');
const resultsScreen = document.querySelector('.results-screen');
const rankingBody = document.getElementById('ranking-body');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const clearAllBtn = document.getElementById('clear-all');

// Modal
const nameModal = document.getElementById('name-modal');
const playerNameInput = document.getElementById('player-name-input');
const confirmNameBtn = document.getElementById('confirm-name');
const cancelNameBtn = document.getElementById('cancel-name');
const nameError = document.getElementById('name-error');

// Estado
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timeLeft = 60;
let timerInterval;
let playerName = "";
let respostasUsuario = [];

// Eventos base
startQuizBtn.addEventListener('click', showNameModal);
nextQuestionBtn.addEventListener('click', nextQuestion);
submitQuizBtn.addEventListener('click', finishQuiz);
restartQuizBtn.addEventListener('click', restartQuiz);

confirmNameBtn.addEventListener('click', confirmName);
cancelNameBtn.addEventListener('click', cancelName);
playerNameInput.addEventListener('keypress', e => { if (e.key === 'Enter') confirmName(); });

// Tabs
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.getAttribute('data-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
    if (tabId === 'ranking') updateRanking();
  });
});

// Modal
function showNameModal() {
  nameModal.style.display = 'flex';
  nameError.style.display = 'none';
  setTimeout(() => playerNameInput.focus(), 50);
}
function confirmName() {
  const name = playerNameInput.value.trim();
  if (!name) {
    nameError.style.display = 'block';
    playerNameInput.focus();
    return;
  }
  playerName = name;
  nameModal.style.display = 'none';
  startQuiz();
}
function cancelName() {
  nameModal.style.display = 'none';
  playerNameInput.value = '';
}

// Quiz
function startQuiz() {
  welcomeScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  currentQuestionIndex = 0;
  score = 0;
  respostasUsuario = [];
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  questionText.textContent = q.question;
  questionCounter.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;

  optionsContainer.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const el = document.createElement('div');
    el.className = 'option';
    el.textContent = opt;
    el.dataset.index = idx;
    el.addEventListener('click', () => {
      document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      selectedOption = idx;
      if (currentQuestionIndex < quizQuestions.length - 1) {
        nextQuestionBtn.style.display = 'inline-block';
        submitQuizBtn.style.display = 'none';
      } else {
        nextQuestionBtn.style.display = 'none';
        submitQuizBtn.style.display = 'inline-block';
      }
    });
    optionsContainer.appendChild(el);
  });

  selectedOption = null;
  nextQuestionBtn.style.display = 'none';
  submitQuizBtn.style.display = 'none';
  resetTimer();
}

function nextQuestion() {
  respostasUsuario[currentQuestionIndex] = selectedOption;
  if (selectedOption === quizQuestions[currentQuestionIndex].correct) score++;
  currentQuestionIndex++;
  loadQuestion();
}

function finishQuiz() {
  respostasUsuario[currentQuestionIndex] = selectedOption;
  if (selectedOption === quizQuestions[currentQuestionIndex].correct) score++;
  clearInterval(timerInterval);

  quizScreen.style.display = 'none';
  resultsScreen.style.display = 'block';
  finalScore.textContent = `${score}/${quizQuestions.length}`;

  let msg = "";
  if (score === quizQuestions.length) msg = "Incrível! Você é um verdadeiro especialista em Copa do Mundo!";
  else if (score >= quizQuestions.length * 0.7) msg = "Muito bom! Você conhece bem a história das Copas!";
  else if (score >= quizQuestions.length * 0.5) msg = "Bom trabalho! Você tem um conhecimento razoável sobre o tema.";
  else msg = "Continue estudando! A Copa do Mundo tem muitas histórias interessantes!";
  resultMessage.textContent = msg;

  mostrarResumoRespostas();

  fetch('salvar_resultado.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `nome=${encodeURIComponent(playerName)}&score=${score}`
  }).then(r => r.text()).then(console.log).catch(console.error);
}

function mostrarResumoRespostas() {
  const reviewContainer = document.getElementById('answers-review');
  reviewContainer.innerHTML = '<h3>Resumo das suas respostas</h3>';

  quizQuestions.forEach((q, i) => {
    const correta = q.correct;
    const escolhida = respostasUsuario[i];
    const acertou = correta === escolhida;

    const div = document.createElement('div');
    div.className = `review-item ${acertou ? 'acerto' : 'erro'}`;

    div.innerHTML = `
      <p><strong>${i + 1}. ${q.question}</strong></p>
      <p>Sua resposta: <span class="${acertou ? 'correto' : 'errado'}">${escolhida != null ? q.options[escolhida] : 'Não respondeu'}</span></p>
      <p>Correta: <span class="correto">${q.options[correta]}</span></p>
      <hr>
    `;
    reviewContainer.appendChild(div);
  });
}

function restartQuiz() {
  resultsScreen.style.display = 'none';
  welcomeScreen.style.display = 'block';
}

// Timer
function startTimer() {
  resetTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (currentQuestionIndex < quizQuestions.length - 1) nextQuestion();
      else finishQuiz();
    }
  }, 1000);
}
function resetTimer() {
  timeLeft = 60;
  timerElement.textContent = `Tempo: ${timeLeft}s`;
}

// Ranking
function updateRanking() {
  fetch('salvar_resultado.php')
    .then(res => res.json())
    .then(ranking => {
      ranking.sort((a, b) => b.score - a.score);
      if (ranking.length > 10) ranking = ranking.slice(0, 10);

      rankingBody.innerHTML = '';
      ranking.forEach((entry, index) => {
        const row = document.createElement('tr');
        let rankClass = '';
        if (index === 0) rankClass = 'player-rank-1';
        else if (index === 1) rankClass = 'player-rank-2';
        else if (index === 2) rankClass = 'player-rank-3';

        row.innerHTML = `
          <td class="player-rank ${rankClass}">${index + 1}º</td>
          <td class="player-name">${entry.name}</td>
          <td class="player-score">${entry.score}/${quizQuestions.length}</td>
          <td>${entry.date}</td>
          <td><button class="btn btn-sm remove-player" data-name="${entry.name}">❌</button></td>
        `;
        rankingBody.appendChild(row);
      });

      if (ranking.length === 0) {
        rankingBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;">Nenhum resultado ainda.</td></tr>`;
      }
    })
    .catch(err => console.error("Erro ao carregar ranking:", err));
}

// Excluir jogador
rankingBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-player')) {
    const nome = e.target.getAttribute('data-name');
    if (confirm(`Deseja remover ${nome} do ranking?`)) {
      fetch('salvar_resultado.php', { method: 'DELETE', body: `nome=${encodeURIComponent(nome)}` })
        .then(r => r.text())
        .then(msg => {
          console.log(msg);
          updateRanking();
        })
        .catch(console.error);
    }
  }
});

// Limpar todos
clearAllBtn.addEventListener('click', () => {
  if (confirm("Deseja limpar TODO o ranking?")) {
    fetch('salvar_resultado.php', { method: 'DELETE' })
      .then(r => r.text())
      .then(msg => {
        console.log(msg);
        updateRanking();
      })
      .catch(console.error);
  }
});

// Inicializar
updateRanking();
