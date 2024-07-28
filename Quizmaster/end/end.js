let  incorrectQuestions  =  localStorage.getItem('incorrectQuestions')
let  correctAnswers  =  localStorage.getItem('correctAnswers')
let  counter  = localStorage.getItem('counter')
let  MaxQuestions = localStorage.getItem('MaxQuestions')     
let score =localStorage.getItem('score');
let TimeSpent = localStorage.getItem('timeSpent');
let Attempts = localStorage.getItem('Attempts');      
let Scoretext = document.getElementById('Score');
let  Attempted = document.getElementById('Attempted');      
let  Correctno = document.getElementById('Correct');   
let  correctContain  = document.getElementById('correct-contain');   
let  correctiondiv = document.getElementById('correction'); 
let Time  =  document.getElementById('Time');
let  secondRow  =  document.querySelector('.second-row');
  
 
correctiondiv.innerHTML =   ''; 
if (counter > 0) {    
   correctContain.classList.remove('hidden'); 
}
else if (counter === null) {
    
    counter = 0;
    localStorage.setItem('counter', counter);
}  

console.log(counter)




Correctno.innerHTML = 'you got '+ counter+'/'+MaxQuestions+' questions correct'; 
     
Attempted.innerHTML =  Attempts +'/'+MaxQuestions;  
Time.innerHTML = 'You spent '+TimeSpent+' seconds on the quiz'; 
if (score === null) {
    score = 0;
    localStorage.setItem('score', score);
}

Scoretext.innerHTML = score;
const summaryContainer = document.querySelector('.summary-container');

if (incorrectQuestions !== null && correctAnswers !== null) {
    secondRow.classList.remove('hidden');   
    let incorrectArray = JSON.parse(incorrectQuestions);
    let correctAnswersArray = JSON.parse(correctAnswers);  
         
    for (let i = 0; i < incorrectArray.length; i++) {
        const incorrectQuestion = incorrectArray[i];
        const correctAnswer = correctAnswersArray[i];   
        let incorrectDiv = document.createElement('div');   
        incorrectDiv.id = 'incorrectQuestion'  +  incorrectQuestion;
        incorrectDiv.innerText =(i+1)+ '=>Question '+ incorrectQuestion +' :    '+ 'Correct Answer:'+ correctAnswer;   
        incorrectDiv.classList.add('text-left');    
        correctiondiv.appendChild(incorrectDiv);    
    }
} 

