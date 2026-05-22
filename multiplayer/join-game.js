//this serves no purpose
//its slightly more comfortable to look at like this

const WORKER_URL = "https://testing.anticlankerhammer.org";//put in worker url first

const btn = document.getElementById("join-game");
btn.addEventListener("click", submitCode);
const roomcode = document.getElementById("room-code");
const dispname = document.getElementById("display-name");
const text = document.getElementById("join");
const original = text.textContent;

//to save data, ive shrunken down names
//n is displayname
//i is userid
//c is room code
async function submitCode() 
{
    text.textContent = "joining game, please wait...";
    
    var data = {n : "",c : "",}
    var code = roomcode.value.toUpperCase();
    if(!checkUsernameValidity()){
        alert("display name cannot contain special characters! it messes with my servers (and trust me they are very vulnerable)");
        text.textContent = original;
        return false;
    }
    setTimeout(() => {
        text.textContent = original;
        alert("operation timed out after 30 seconds. Did i forget to pay the bills again?");
    }, 30000);
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello from HTML!' })
        });
        const data = await response.json();
        console.log('Worker replied:', data);                
    } catch (error) {
        console.error('Error:', error);
    }
    // alert("button clicked");
    // console.log("Button was clicked!");
    // testWorker();
}

function checkUsernameValidity()
{
    var displayName = dispname.value;
    // Source - https://stackoverflow.com/a/15874105
    // Posted by Denys Séguret
    // Retrieved 2026-05-22, License - CC BY-SA 3.0
    var letters = /^[0-9a-zA-Z]+$/;
    letters += '-'; // it looks like a little guy lmao
    if (letters.test(displayName)) {
        return true;
    } else {
        return false;
    }
}


async function worker(){
    //get post and options
    //get retrieves data
    //post sends data
    //options checks for cors
}
