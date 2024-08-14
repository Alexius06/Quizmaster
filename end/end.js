let  incorrectQuestions  =  localStorage.getItem('incorrectQuestions')
let  correctAnswers  =  localStorage.getItem('correctAnswers')
let  counter  = localStorage.getItem('counter')
let  MaxQuestions = localStorage.getItem('MaxQuestions')     
let score =localStorage.getItem('score');
let MinutesSpent =  localStorage.getItem('minutesSpent');   
let SecondsSpent = localStorage.getItem('secondsSpent');   
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

    document.getElementById('logout').addEventListener('click', () => {         
        clearSession(); 
    });
    if (!userName || !profilePic) {
        window.location.assign('../index/index.html');
    } else {
        document.getElementById('display-name').textContent =`CONGRATS! on completing this quiz ${userName}`;
        const img  =  document.createElement('img');
        img.src =   profilePic
        img.alt =  'Profile Pic';   
        img.classList.add('rounded-full','w-16','h-16');
        document.getElementById('profile-pic').innerHTML = '';
        document.getElementById('profile-pic').appendChild(img);    
    }
};


Correctno.innerHTML = 'you got '+ counter+'/'+MaxQuestions+' questions correct'; 
     
Attempted.innerHTML =  Attempts +'/'+MaxQuestions;  
if (MinutesSpent<1){
    MinutesSpent = ''
}
else if (MinutesSpent ==  1){
    MinutesSpent = MinutesSpent +' minute '  
}
else{
    MinutesSpent = MinutesSpent + ' minutes '   
}
console.log (MinutesSpent   )
Time.innerHTML = 'You spent '+MinutesSpent+SecondsSpent+' seconds on the quiz'; 
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

