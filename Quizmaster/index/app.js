






var  loginbtn  =document.getElementById('LOGIN');   
var  playbtn  =document.getElementById('play');
var  savebtn = document.getElementById('save'); 
var  landingpg = document.getElementById('home');  
var  register  = document.getElementById('profileSetup');
var  login = document.getElementById('profileLogin');   
var  verify = document.getElementById('verify');    
var  register_email = document.getElementById('register_email').value;  
var  regpwd = document.getElementById('regpwd').value;  
var  regcpwd = document.getElementById('regcpwd').value; 
var  login_email = document.getElementById('login_email').value;  
var  logpwd = document.getElementById('logpwd').value;    
const name = document.getElementById('nameInput').value;
const profilePics = document.querySelectorAll('.Profile');

let selectedPic = null;


function checkSession() {
    const userName = localStorage.getItem('userName');
    const profilePic = localStorage.getItem('selectedPic');
    if (userName && profilePic) {
        setTimeout(clearSession, 720000);
    } else {
        landingpg.classList.remove('hidden');
        login.classList.add('hidden');
    }
    profilePics.forEach(pic => {
    pic.addEventListener('click', () => {
        profilePics.forEach(p => p.classList.remove('selectedpp'));
        pic.classList.add('selectedpp');
        selectedPic = pic.getAttribute('data-pic');
    });
});
}

function clearSession() {
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPic');
    window.location.assign('../index.html');  
}




function togglePasswordVisibility(passwordFieldid, togglePwdIconid) {
    const passwordField = document.getElementById(passwordFieldid);
    const togglePwdIcon = document.getElementById(togglePwdIconid);
    
    togglePwdIcon.addEventListener('click', function () {
        if (passwordField.getAttribute('type') === 'password') {
            passwordField.setAttribute('type', 'text');
            this.textContent = '🙈';
        } else {
            passwordField.setAttribute('type', 'password');
            this.textContent = '👁️';
        }
    })
}
playbtn.addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    if (!name && selectedPic==null) {
        
        landingpg.classList.add('hidden');
        login.classList.remove('hidden');  
    } else {
        window.location.assign('../game/game.html');    
    }
});
loginbtn.addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    if (!name && selectedPic==null) {
        
        landingpg.classList.add('hidden');
        login.classList.remove('hidden');  
    } else {
        document.getElementById('home2').classList.remove('hidden');       
    }
});

document.getElementById('regrequest').addEventListener('click', function() {
    login.classList.add('hidden'); 
    register.classList.remove('hidden');      
}); 
document.getElementById('logrequest').addEventListener('click', function() {
    login.classList.remove('hidden'); 
    register.classList.add('hidden');      
}); 


function back(backbtnid,targetid){
    var  backbtn  =  document.getElementById(backbtnid);
    var  target  = document.getElementById(targetid);   
    backbtn.addEventListener('click', function() {
        target.classList.add('hidden');
        landingpg.classList.remove('hidden');  
        
    });    
}       