var  playbtn  =document.getElementById('play');
var  backbtn  =  document.getElementById('backbtn');
var  savebtn = document.getElementById('save'); 
var  landingpg = document.getElementById('home');  
var  register  = document.getElementById('profileSetup');
const name = document.getElementById('nameInput').value;
const profilePics = document.querySelectorAll('.Profile');
let selectedPic = null;


function checkSession() {
    const userName = localStorage.getItem('userName');
    const profilePic = localStorage.getItem('selectedPic');
    if (userName && profilePic) {
        setTimeout(clearSession, 7000);
    } else {
        landingpg.classList.remove('hidden');
        register.classList.add('hidden');
    }
}

function clearSession() {
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPic');
    window.location.assign('../index.html');  
}

checkSession();
profilePics.forEach(pic => {
    pic.addEventListener('click', () => {
        profilePics.forEach(p => p.classList.remove('selectedpp'));
        pic.classList.add('selectedpp');
        selectedPic = pic.getAttribute('data-pic');
    });
});

playbtn.addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    if (!name && selectedPic==null) {
        
        landingpg.classList.add('hidden');
        register.classList.remove('hidden');  
    } else {
        window.location.assign('../game/game.html');    
    }
});

savebtn.addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;

    if (name && selectedPic) {
        
        localStorage.setItem('userName', name);
        localStorage.setItem('selectedPic', selectedPic);
        
        document.getElementById('regerror').innerText = ''
        window.location.assign('../game/game.html');        
    } else {
        document.getElementById('regerror').innerText = '*Please input a name and select a  picture';
            
    }
    
});

backbtn.addEventListener('click', function() {
    register.classList.add('hidden');
    landingpg.classList.remove('hidden');  

});       