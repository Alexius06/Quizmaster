var question = document.getElementById('question'); 
var options = Array.from(document.getElementsByClassName('choice-text'));     
let Questioncount =document.getElementById('Questioncount');
let Scoretext = document.getElementById('Score'); 
let progressbarfull = document.getElementById('progress-bar-full'); 
let timerDisplay = document.getElementById('Timer');
let startTime, endTime;    
let currentQuestion = {};
let  counter = 0
let acceptinganswers  =  true; 
let score  =  0;
let availableQuestions = [];   
let  questionIndex = 0; 
let currentIndex = -1;
let history = [];
const TOTAL_TIME = 60;
let questionCounter = 0;
let  Attempts = 0;
let questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript??',
        choice1: '<script>',
        choice2: '<javascript>',
        choice3: '<js>',
        choice4: '<scripting>',
        answer: 1,
    },
    {
        question:
            "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4,
    },
    
];
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = questions.length;
localStorage.setItem('MaxQuestions', MAX_QUESTIONS )

let answeredQuestions = new Set();
let selectedAnswers = {};
startGame = () => {   
    questionCounter = 0;
    score = 0;
    counter = 0;
    startTime = new Date().getTime();
    startTimer();    
    availableQuestions = [...questions];
    incorrectQuestions = [];
    correctAnswers = [];
    localStorage.removeItem('incorrectQuestions');
    localStorage.removeItem('correctAnswers');
    localStorage.removeItem('Attempts');
    localStorage.removeItem('score');   
    localStorage.removeItem('counter');     
    console.log(availableQuestions);
    getNewQuestion();
};
function startTimer() {
    let timeLeft = TOTAL_TIME;

    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerHTML = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function roundUp(num) {
    return Math.ceil(num * 100) / 100;
}

function updateQuestionBubbles() {
    const bubblesContainer = document.getElementById('question-bubbles');
    bubblesContainer.innerHTML = ''; // Clear existing bubbles

    questions.forEach((_, index) => {
        const bubble = document.createElement('div');
        bubble.id = 'question-bubble-' + index;
        bubble.classList.add('w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-white', 'border', 'border-gray-400', 'rounded-full', 'm-1');
        bubble.innerText = index + 1; // Add question number inside the bubble

        if (answeredQuestions.has(index)) {
            bubble.classList.add('bg-blue-500', 'cursor-pointer'); // Blue for answered questions
            bubble.addEventListener('click', () => goToQuestion(index)); // Click event to go to the question
        } else {
            bubble.classList.add('bg-gray-400'); // Gray for unanswered questions
        }

        bubblesContainer.appendChild(bubble);
    });
}

function goToQuestion(index) {
    currentQuestion = questions[index];
    questionIndex = index + 1;
    renderQuestion();
}

getNewQuestion = () => {    
    if (questionCounter >= MAX_QUESTIONS) {
        endQuiz();
        return;
    }
    
    currentQuestion = questions[questionCounter];
    questionIndex = questionCounter + 1; 
    questionCounter++;
    history = history.slice(0, currentIndex + 1); 
    history.push({ index: questionIndex, question: currentQuestion });
    currentIndex = history.length - 1;
    
    renderQuestion();  
    updateQuestionBubbles();
};
function renderQuestion() {
    Questioncount.innerHTML = questionIndex + "/" + MAX_QUESTIONS;
    
    progressbarfull.innerHTML = roundUp(questionCounter / MAX_QUESTIONS) * 100 + "%";
    question.innerText = currentQuestion.question;

    options.forEach(option => {
        const number = option.dataset['number'];
        option.innerText = currentQuestion['choice' + number];
        progressbarfull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";
        option.parentElement.classList.remove('correct', 'incorrect', 'selected');
        if (selectedAnswers[questionCounter - 1] === parseInt(number)) {
            option.parentElement.classList.add('selected');
        }   
    });

    acceptinganswers = true;
}



document.getElementById('prev-question').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        const previousQuestion = history[currentIndex];
        questionIndex = previousQuestion.index;
        currentQuestion = previousQuestion.question;
        renderQuestion();
    };
});

document.getElementById('next-question').addEventListener('click', () => {
    if (currentIndex < history.length - 1) {
        currentIndex++;
        const nextQuestion = history[currentIndex];
        questionIndex = nextQuestion.index;
        currentQuestion = nextQuestion.question;
        renderQuestion();
    };
});
let incorrectQuestions = [];
let correctAnswers = [];
options.forEach((option) => {  
    option.addEventListener('click', e => {
        if(!acceptinganswers) return;
        acceptinganswers=false; 
            
        const selectedOption = e.target;    
        const selectedAnswer = selectedOption.dataset['number'];
        
        selectedOption.classList.add('selected'); 
        Attempts++; 
        answeredQuestions.add(questionCounter - 1);
        selectedAnswers[questionCounter - 1] = selectedAnswer;
            
        if  (selectedAnswer == currentQuestion.answer){
            
            counter++;  
            incrementScore(CORRECT_BONUS);
            console.log(counter);    
            localStorage.setItem('counter', counter);         
        }      
        else  if(selectedAnswer !==  currentQuestion.answer){
            let questionNumber = questionCounter;
            let correctAnswer = currentQuestion['choice' + currentQuestion.answer];
            console.log(correctAnswer);
            console.log(questionNumber);                
            incorrectQuestions.push(questionNumber);
            correctAnswers.push(correctAnswer);
            console.log(correctAnswers); 
            console.log(incorrectQuestions);                            
            localStorage.setItem('incorrectQuestions', JSON.stringify(incorrectQuestions));
            localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
        }
       
          
        if (questionCounter<=MAX_QUESTIONS) {
            setTimeout(() => {                
                getNewQuestion();
            }, 1200);
        }
          
    });
 });
function endQuiz() {
    endTime = new Date().getTime();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    localStorage.setItem('Attempts',  Attempts);       
    localStorage.setItem('timeSpent', timeSpent);    
    window.location.assign('../end/end.html');
}
incrementScore = num =>  {
    score += num;
    localStorage.setItem('score', score);   
       
};

startGame();
