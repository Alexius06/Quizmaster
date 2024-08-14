var question = document.getElementById('question'); 
var options = Array.from(document.getElementsByClassName('choice-text'));     
let Questioncount =document.getElementById('Questioncount');
var loader = document.querySelector('.loader');        
var  game = document.getElementById('game');    
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
let questionCounter = 0;

let  Attempts = 0;
let questions = [];

fetch('https://opentdb.com/api.php?amount=50&category=18&difficulty=medium&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        // console.log(loadedQuestions.results)
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            
            return formattedQuestion;
        });
        setTimeout(() => { 
            loader.classList.add('hidden'); 
            game.classList.remove('hidden');   
            startGame();    
        },4000); 
        
    })
    .catch((err) => {
        console.error(err);
    });

const CORRECT_BONUS = 10;
let  MAX_QUESTIONS;
let answeredQuestions = new Set();
let selectedAnswers = {};
let time; 

startGame = () => {   
    questionCounter = 0;
    score = 0;
    counter = 0;
    startTime = new Date().getTime();
        
    availableQuestions = [...questions];
    incorrectQuestions = [];
    correctAnswers = [];
    MAX_QUESTIONS = questions.length;    
    time=  54  *  MAX_QUESTIONS;
    
    startTimer();
    localStorage.setItem('MaxQuestions', MAX_QUESTIONS )
    localStorage.removeItem('incorrectQuestions');
    localStorage.removeItem('correctAnswers');
    localStorage.removeItem('Attempts');
    localStorage.removeItem('score');   
    localStorage.removeItem('counter');  
    // console.log(questions)   
    // console.log(availableQuestions);
    getNewQuestion();
    loader.classList.add('hidden'); 
    game.classList.remove('hidden');
    
};
function startTimer() {
    let timeLeft = time;
    let minutes,  seconds;
    const timerInterval = setInterval(() => {
        minutes=Math.floor(timeLeft/ 60);
        seconds = timeLeft % 60;    
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timeLeft--;
        timerDisplay.textContent = minutes+':'+seconds;

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
    bubblesContainer.innerHTML = '';  
    questions.forEach((_, index) => {
        const bubble = document.createElement('div');
        bubble.id = 'question-bubble-' + index;
        bubble.classList.add('w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-white', 'border', 'border-gray-400', 'rounded-full', 'm-1');
        bubble.innerText = index + 1;
        
        if (index === questionCounter - 1) {
            bubble.classList.add('bg-yellow-500', 'cursor-pointer');
            bubble.addEventListener('click', () => goToQuestion(index));
        }
        else if (answeredQuestions.has(index)) {
            bubble.classList.add('bg-blue-500', 'cursor-pointer'); // Blue for answered questions
            bubble.addEventListener('click', () => goToQuestion(index)); // Click event to go to the question
        } 
        
        else {
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
    options.forEach((option)=>{
        option.classList.remove('selected');
    })
    renderQuestion();  
    updateQuestionBubbles();
};
function renderQuestion() {
    Questioncount.innerHTML = questionIndex + "/" + MAX_QUESTIONS;    
    progressbarfull.innerHTML = Math.ceil(roundUp(questionCounter / MAX_QUESTIONS) * 100) + "%";
    
    // console.log(questionCounter/ MAX_QUESTIONS )
    // console.log(questionCounter)

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
        options.forEach((opt) => {opt.classList.remove('selected'); });    
        selectedOption.classList.add('selected'); 
        Attempts++; 
        answeredQuestions.add(questionCounter - 1);
        selectedAnswers[questionCounter - 1] = selectedAnswer;
            
        if  (selectedAnswer == currentQuestion.answer){
            
            counter++;  
            incrementScore(CORRECT_BONUS);
            // console.log(counter);    
            localStorage.setItem('counter', counter);         
        }      
        else  if(selectedAnswer !==  currentQuestion.answer){
            let questionNumber = questionCounter;
            let correctAnswer = currentQuestion['choice' + currentQuestion.answer];
            // console.log(correctAnswer);
            // console.log(questionNumber);                
            incorrectQuestions.push(questionNumber);
            correctAnswers.push(correctAnswer);
            // console.log(correctAnswers); 
            // console.log(incorrectQuestions);                            
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

    

window.onload = function() {
    const userName = localStorage.getItem('userName');
    const profilePic = localStorage.getItem('selectedPic');
    function checkSession() {
        
        if (userName && profilePic) {
            setTimeout(clearSession, 7200000);
        }
        
    }
    
    function clearSession() {
        localStorage.removeItem('userName');
        localStorage.removeItem('selectedPic');
        window.location.assign('../index/index.html');  
    }
    
    checkSession();
    

    if (!userName || !profilePic) {
        window.location.assign('../index/index.html');
    } else {
        document.getElementById('display-name').textContent ='Hi,'+ userName;
        const img  =  document.createElement('img');
        img.src =   profilePic
        img.alt =  'Profile Pic';   
        img.classList.add('rounded-full','w-16','h-16');
        document.getElementById('profile-pic').innerHTML = '';
        document.getElementById('profile-pic').appendChild(img);  
    }
};
function endQuiz() {
    endTime = new Date().getTime();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    minutesSpent  = Math.floor(timeSpent/ 60);
    secondsSpent = timeSpent % 60;  
    localStorage.setItem('Attempts',  Attempts);       
    localStorage.setItem('minutesSpent', minutesSpent);    
    localStorage.setItem('secondsSpent', secondsSpent);    
    window.location.assign('../end/end.html');
}
incrementScore = num =>  {
    score += num;
    localStorage.setItem('score', score);   
       
};
