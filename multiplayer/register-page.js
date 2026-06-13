const registerWorker = "https://reg-worker.anticlankerhammer.org";
const btn = document.getElementById("register");
btn.addEventListener("click", RegisterWebsite);
const username  = document.getElementById("username");
const password  = document.getElementById("password");
const confpassword  = document.getElementById("password2");
const email     = document.getElementById("email");
const text      = document.getElementById("login-header");
const original      = text.textContent;
var canPress        = true;
const build     = document.getElementById("build-version");
const usernameRegex = /^[a-zA-Z0-9_-]+$/;
build.textContent   = "beta 0.1.14"; 
window.addEventListener('beforeunload', function (event) {
    // Cancel the event as stated by the standard
    event.preventDefault();
    this.alert("this page WILL not bother to save any changes you made because the developer cant be fucked");
    // Chrome/Firefox require returnValue to be set to an empty string
    event.returnValue = ''; 
});

async function RegisterWebsite()
{
    if(canPress)
    {
        //add a few more checks here later
        //eg username validity, check if email is ok
        if (!usernameRegex.test(username.value)) {
        alert("Username can only contain letters, numbers, dashes, and underscores.");
        return; // Stops the code from running the fetch request entirely
        }
        
        if(password.value != confpassword.value)
        {
            alert("password and confirmation password must match!");
            confpassword.value = "";
            return;
        }

        if(email.value == "")
        {
            email.value = "no-email";
        }

        canPress = false;
        text.textContent = "attempting to contact palantir and related 3-letter organizations, please wait...";
        //check login
        
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
            text.textContent = original;
            alert("operation timed out after 30 seconds. Did i forget to pay the bills again?");
            canPress = true;
        }, 30000);


       
        try {
             const data = {
                username: username.value, //inconsistent capitaling but idgaf
                email: email.value,
                password: password.value
            };
            const response = await fetch(registerWorker, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            text.textContent = original;
            canPress = true;
            //checks for http error
            if (!response.ok) {
                if(response.status === 409)
                {
                    alert(response.message);
                }
                else{
                    alert(`Server responded with status: ${response.status}`);
                }
            }
            else
            {
                //redirect
                window.location.href = 'login-page.html'; 

            }
            const responsedata = await response.json();

            //more data here
            //maybe success maybe failure

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
        if(email.value == "no-email")
        {
            email.value = "";
        }
        
        canPress = true;
    }
    else
    {
        alert("Everytime you spam a request, i send 500k to israel");
    }

}

