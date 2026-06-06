const registerWorker = "https://reg-worker.anticlankerhammer.org";
const btn = document.getElementById("register");
btn.addEventListener("click", RegisterWebsite);
const Username  = document.getElementById("username");
const password  = document.getElementById("password");
const confpassword  = document.getElementById("password2");
const email     = document.getElementById("email");
const text      = document.getElementById("login-header");
const original  = text.textContent;
var canPress    = true;

window.addEventListener('beforeunload', function (event) {
    // Cancel the event as stated by the standard
    event.preventDefault();
    
    // Chrome/Firefox require returnValue to be set to an empty string
    event.returnValue = ''; 
});

async function RegisterWebsite()
{
    if(canPress)
    {
        //add a few more checks here later
        //eg username validity, check if email is ok

        if(email.value == "")
        {
            email.value = "no-email";
        }

        if(password.value != confpassword.value)
        {
            alert("password and confirmation password must match!");
            confpassword.value = "";
        }

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


        var data = [Username.value,email.value,password.value];
        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const data = await response.json();
            readReturnData(data);
            //more data here
            //maybe success maybe failure

        } catch (error) {
            alert('Error:', error.message);
            canPress = true;
        }
        if(email.value == "no-email")
        {
            email.value = "";
        }
    }
    else
    {
        alert("Everytime you spam a request, i send 500k to israel");
    }

}