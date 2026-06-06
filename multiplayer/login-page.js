const loginWorker = "https://log-worker.anticlankerhammer.org";
const btn = document.getElementById("login");
btn.addEventListener("click", LoginToWebsite);
const Username = document.getElementById("username");
const password = document.getElementById("password");
const text = document.getElementById("login-header");
const original = text.textContent;
var canPress = true;

window.addEventListener('beforeunload', function (event) {
    // Cancel the event as stated by the standard
    event.preventDefault();
    
    // Chrome/Firefox require returnValue to be set to an empty string
    event.returnValue = ''; 
});

async function LoginToWebsite()
{
    if(canPress)
    {
        canPress = false;
        text.textContent = "attempting to contact palantir and related 3-letter organizations, please wait...";
        //check login


        setTimeout(() => {
            text.textContent = original;
            alert("operation timed out after 30 seconds. Did i forget to pay the bills again?");
        }, 30000);
        setTimeout(() => {
            canPress = true;
        }, 12000);


        var data = [Username.value,password.value];

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const data = await response.json();
            readReturnData(data);
            document.cookie = data.headers.Set-Cookie;

            //debug only please
            console.log('Worker replied:', data);
        } catch (error) {
            console.log(error.message);
            alert('Error:', error.message);
            canPress = true;
        }
    }
    else
    {
        alert("Everytime you spam a request, i send 500k to israel");
    }
}