// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbpZo5Mo-SdvWYa2IQO-LpjP9ecYq47u8",
    authDomain: "quizmaster-912df.firebaseapp.com",
    projectId: "quizmaster-912df",
    storageBucket: "quizmaster-912df.appspot.com",
    messagingSenderId: "870799094476",
    appId: "1:870799094476:web:2db4d50b8269ebc2324869",
    measurementId: "G-0J374FDH4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


var  playbtn  =document.getElementById('play');
var  savebtn = document.getElementById('save'); 
var  landingpg = document.getElementById('home');  
var  register  = document.getElementById('profileSetup');
var  login = document.getElementById('profileLogin');   
var  verify = document.getElementById('verify');    

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
checkSession(); 
function clearSession() {
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedPic');
    window.location.assign('../index.html');  
}

playbtn.addEventListener('click', function() {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        
        landingpg.classList.add('hidden');
        login.classList.remove('hidden');  
    } else {
        window.location.assign('../game/game.html');    
    }
});
verify.addEventListener('click', async function() {
    const login_email = document.getElementById('login_email').value;
    const logpwd = document.getElementById('logpwd').value;

    if (login_email && logpwd) {
        try {
            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, login_email, logpwd);
            const user = userCredential.user;

            // Retrieve user details from Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                localStorage.setItem('userName', userData.name);
                localStorage.setItem('selectedPic', userData.selectedPic);
                document.getElementById('logsuccess').innerText = 'Login successful';
                document.getElementById('logerror').innerText = '';

                setTimeout(() => {
                    window.location.assign('../game/game.html');
                }, 1000);
            } else {
                document.getElementById('logerror').innerText = 'User data not found';
            }
        } catch (error) {
            document.getElementById('logerror').innerText = '*Incorrect email or password';
        }
    } else {
        document.getElementById('logerror').innerText = '*Please input your email and password';
    }
});    

savebtn.addEventListener('click', async function() {
    const name = document.getElementById('nameInput').value;
    var regpwd = document.getElementById('regpwd').value;  
    var regcpwd = document.getElementById('regcpwd').value;
    var  register_email = document.getElementById('register_email').value;  
    if (regpwd !== regcpwd) {
        document.getElementById('pwderror').innerText = '*Passwords do not match';
    } 
    else if (name && selectedPic && register_email && regpwd) {
        document.getElementById('pwderror').innerText = '';

        try {
            // Create a new user
            const userCredential = await createUserWithEmailAndPassword(auth, register_email, regpwd);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: register_email,
                selectedPic: selectedPic,
            });

            document.getElementById('regsuccess').innerText = 'Registered successfully';
            setTimeout(() => {
                window.location.assign('../game/game.html');
            }, 1000);
        } 
        catch (error) {
            if (error.code === 'auth/email-already-in-use') {                
                document.getElementById('regerror').innerText = '*Email is already in use';
            } 
            else {
                console.log('Error:', error.message);
            }
        }
    } else {
        document.getElementById('regerror').innerText = '*Please input all credentials';
    }
    
    
});