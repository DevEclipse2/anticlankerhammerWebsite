//this serves no purpose
//its slightly more comfortable to look at like this
const roomcodeLength = 6;
const WORKER_URL = "https://testing.anticlankerhammer.org";//put in worker url first

const btn = document.getElementById("join-game");
btn.addEventListener("click", submitCode);
const roomcode = document.getElementById("room-code");
const dispname = document.getElementById("display-name");
const text = document.getElementById("join");
const original = text.textContent;
var canPress = true;
//to save data, ive shrunken down names
//n is displayname
//i is userid
//c is room code
async function submitCode() 
{
    if(canPress)
    {
        canPress = false;
        text.textContent = "joining game, please wait...";
        if(!checkUsernameValidity()){
            alert("display name cannot contain special characters! it messes with my servers (and trust me they are very vulnerable)");
            text.textContent = original;
            canPress = true;
            return;
        }
        switch(checkRoomnameValidity()){
            case 0:
                alert("incorrect room code length");
                canPress = true;
                return;
            case 1:
                alert("room codes do not include special characters!");
                canPress = true;
                return;
            case 2:
                //the code is good
                break;
            default:
                alert("something bad happened and now i don't know anymore");
                canPress = true;
                break;
        }
        setTimeout(() => {
            text.textContent = original;
            alert("operation timed out after 30 seconds. Did i forget to pay the bills again?");
        }, 30000);
        setTimeout(() => {
            canPress = true;
        }, 12000);

        var data = {o: "join" ,n : dispname.value,c : roomcode.value.toUpperCase()};
        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const data = await response.json();
            readReturnData(data);
            console.log('Worker replied:', data);
        } catch (error) {
            alert('Error:', error);
        }
    }
    else
    {
        alert("Do not send so many requests!");
    }
}

function checkUsernameValidity()
{
    var displayName = dispname.value;
    // Source - https://stackoverflow.com/a/15874105
    // Posted by Denys Séguret
    // Retrieved 2026-05-22, License - CC BY-SA 3.0
    //changed to allow for - (hyphen) and _ (underscore)
    const letters = /^[0-9a-zA-Z-_]+$/;
    if (letters.test(displayName)) {
        return true;
    } else {
        return false;
    }
}

function checkRoomnameValidity()
{
    var checkcode = roomcode.value.toUpperCase();
    if(checkcode.length != roomcodeLength){
        //wrong length
        return 0;
    };
    const letters = /^[0-9A-Z]+$/;
    if (letters.test(checkcode)) {
        //valid room code format
        return 2;
    } else {
        //invalid format
        return 1;
    }
}

//returned data is going to have a user token and a pusher token
function readReturnData(data){
    if(!data.ut){
        //idk
    }
    if(!data.pt)
    {

    }
}

async function worker(){
    //get post and options
    //get retrieves data
    //post sends data
    //options checks for cors
}
