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
let bubblecount;
let  Attempts = 0;
let questions = [];
let questionId;

fetch('https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        console.log(loadedQuestions.results)
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
let questionstatus;

startGame = () => {   
    questionCounter = 0;
    bubblecount = 0;    
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
    for (let key in localStorage) {
        if (key.startsWith('question_')) {
            localStorage.removeItem(key);
        }
    }   
     
    // console.log(questions)   
    console.log(availableQuestions);
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
        
        if (index === bubblecount-1 ) {
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
    questionId=questionIndex
    questionstatus = localStorage.getItem(`question_${questionId}`);
    renderQuestion();
}

getNewQuestion = () => {    
    if (questionCounter >= MAX_QUESTIONS) {
        setTimeout(endQuiz(),1000);
    }        
    currentQuestion = questions[questionCounter];    
    questionIndex = questionCounter + 1;
    questionId  =  questionIndex 
    console.log('questionId:'+questionId);
    questionstatus = localStorage.getItem(`question_${questionId}`); 
    if (!questionstatus) {
        localStorage.setItem(`question_${questionId}`, 'unanswered');
        questionstatus = localStorage.getItem(`question_${questionId}`); ;
    }
    questionCounter++;
    bubblecount  =  questionCounter>bubblecount ? questionCounter: bubblecount;
    history = history.slice(0, currentIndex + 1); 
    history.push({ index: questionIndex, question: currentQuestion });
    currentIndex = history.length - 1;
    // options.forEach(option => {
    //     option.classList.remove('selected');
    // });
    
    renderQuestion();  
    updateQuestionBubbles();
};
function renderQuestion() {
    Questioncount.innerHTML = questionIndex + "/" + MAX_QUESTIONS; 
    questionCounter = questionIndex;   
    progressbarfull.innerHTML = Math.ceil(roundUp(questionCounter / MAX_QUESTIONS) * 100) + "%";
    console.log(`question_${questionId}:${questionstatus}`);    
    
    // console.log(questionCounter/ MAX_QUESTIONS )
    // console.log(questionCounter)

    question.innerText = currentQuestion.question;

    options.forEach(option => {
        var number = option.dataset['number'];
          
        option.innerText = currentQuestion['choice' + number];
        progressbarfull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";
        option.classList.remove('correct', 'incorrect', 'selected');


        if (questionstatus !== 'unanswered') {            
            option.style.pointerEvents = 'none';
        } else {            
            option.style.pointerEvents = 'auto';
        }
        
        if (selectedAnswers[questionId] === number) {
            if (number  == currentQuestion.answer){
            option.classList.add('correct');
            }
            else{
                option.classList.add('incorrect');                  
                options.forEach(opt => {
                    console.log(opt.dataset['number']);
                    console.log(currentQuestion.answer);
                    if (opt.dataset['number'] == currentQuestion.answer) {
                        opt.classList.add('correct');
                    }
                });
            }
            
        } 
        
          
    });

    acceptinganswers = true;
}



document.getElementById('prev-question').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex  =  questionIndex-1
        currentIndex--;
        const previousQuestion = history[currentIndex];
        questionIndex = previousQuestion.index;
        currentQuestion = previousQuestion.question;
        goToQuestion(currentIndex);
    };
});

document.getElementById('next-question').addEventListener('click', () => {
    if (currentIndex < history.length - 1) {
        currentIndex++;
        const nextQuestion = history[currentIndex];
        questionIndex = nextQuestion.index;
        currentQuestion = nextQuestion.question;
        goToQuestion(currentIndex);
    };
});
let incorrectQuestions = [];
let correctAnswers = [];

function updateCounter(increment) {
    let counter = parseInt(localStorage.getItem('counter')) || 0;
    counter += increment;
    if (counter < 0){counter = 0;} // Prevent negative counter
    console.log("counter:" + counter);
    localStorage.setItem('counter', counter);
}


// Function to save the question's status and related data
function saveQuestionStatus(questionId, status, correctAnswer = null, questionNumber = null) {
    let incorrectQuestions = JSON.parse(localStorage.getItem('incorrectQuestions')) || [];
    let correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || [];

    if (status === 'correct') {
        let incorrectIndex = incorrectQuestions.indexOf(questionNumber);
        if (incorrectIndex !== -1) {
            incorrectQuestions.splice(incorrectIndex, 1);
            correctAnswers.splice(incorrectIndex, 1);
        }
    } else if (status === 'incorrect') {
        if (!incorrectQuestions.includes(questionNumber)) {
            incorrectQuestions.push(questionNumber);
            correctAnswers.push(correctAnswer);
        }
    }
    
    localStorage.setItem(`question_${questionId}`, status);
    localStorage.setItem('incorrectQuestions', JSON.stringify(incorrectQuestions));
    localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
}

questionstatus = localStorage.getItem(`question_${questionId}`);

options.forEach((option) => {   
    option.addEventListener('click', e => {
        if (!acceptinganswers) return;
        acceptinganswers = false;

        if (questionstatus !== 'unanswered') {
            option.disabled  =true;
        }
        
        const selectedOption = e.target;    
        const selectedAnswer = selectedOption.dataset['number'];
        options.forEach((opt) => opt.classList.remove('selected'));
        selectedOption.classList.add('selected');
        
        Attempts++;
        answeredQuestions.add(questionCounter - 1);
        selectedAnswers[questionId] = selectedAnswer;
        console.log(selectedAnswers);   

        // Fetch the current status of the question
        number = option.dataset['number'];
        if (selectedAnswers[questionId] === number) {
            if (number  == currentQuestion.answer){
            option.classList.add('correct');
            }
            else{
                option.classList.add('incorrect');                  
                options.forEach(opt => {
                    console.log(opt.dataset['number']);
                    console.log(currentQuestion.answer);
                    if (opt.dataset['number'] == currentQuestion.answer) {
                        opt.classList.add('correct');
                    }
                });
            }
            
        } 
        // Check if the answer is correct
        if (selectedAnswer == currentQuestion.answer) {
            if (questionstatus !== 'correct') {
                updateCounter(1);
            }
            saveQuestionStatus(questionId, 'correct', null, questionCounter);
        } else {
            // Check if the question was previously answered correctly
            if (questionstatus === 'correct') {
                updateCounter(-1);
            }
            let questionNumber = questionCounter;
            let correctAnswer = currentQuestion['choice' + currentQuestion.answer];
            saveQuestionStatus(questionId, 'incorrect', correctAnswer, questionNumber);
        }
        questionstatus = localStorage.getItem(`question_${questionId}`);
        console.log(`questionstatus${questionId}:${questionstatus}`);
        // Prepare for the next question
        acceptinganswers = true;       // let questionId = questionIndex;
        
        
       
          
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
    console.log(profilePic);
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
    

    if (!userName) {
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
    Attempts = Attempts>questionIndex ? questionIndex : Attempts;
       
    localStorage.setItem('Attempts',  Attempts);       
    localStorage.setItem('minutesSpent', minutesSpent);    
    localStorage.setItem('secondsSpent', secondsSpent);    
    window.location.assign('../end/end.html');
}

