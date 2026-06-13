const loginWorker = "https://log-worker.anticlankerhammer.org";
const btn = document.getElementById("login");
btn.addEventListener("click", LoginToWebsite);
const username = document.getElementById("username");
const password = document.getElementById("password");
const text = document.getElementById("login-header");
const original = text.textContent;
document.getElementById("build-version").textContent = "beta 0.0.4";
var canPress = true;
const usernameRegex = /^[a-zA-Z0-9_-]+$/;

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
        if (!usernameRegex.test(username.value)) {
        alert("Username can only contain letters, numbers, dashes, and underscores.");
        canPress = true;
        return; // Stops the code from running the fetch request entirely
        }
        if(username.value === "" )
        {
            alert("to login , you need A USERNAME");
            canPress = true;
            return; // Stops the code from running the fetch request entirely
        }
        if(password.value === "" )
        {
            alert("you think we'll just take your word for it? THE PASSWORD. USE IT !");
            canPress = true;
            return; // Stops the code from running the fetch request entirely
        }
        const timeoutId = setTimeout(() => {
            controller.abort();
            text.textContent = original;
            alert("operation timed out after 30 seconds. Did i forget to pay the bills again?");
            canPress = true;
        }, 30000);

        

        try {
            const data = {username: username.value, username: password.value};
        
            const response = await fetch(loginWorker, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const responsedata = await response.json();
            if (!response.ok) {
                
                alert(`Server responded with status: ${response.status}`);
            }
            else
            {
                //redirect
                readReturnData(responsedata);

            }
            
        } catch (error) {
            clearTimeout(timeoutId); //clear timeout
            text.textContent = original;
            if (error.name === 'AbortError') {
                console.log('Fetch aborted due to timeout.');
            } else {
                // fixed to actually show error
                alert(`Error: ${error.message}`);
            }
            
            
        }
        canPress = true;
    }
    else
    {
        alert("Everytime you spam a request, i send 500k to israel");
    }
}

function readReturnData(data){
    if(data.message === "Login successful")
    {
        document.cookie = data.headers.Set-Cookie;
        alert("login success");
    }
}