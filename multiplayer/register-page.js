const registerWorker = "";
const btn = document.getElementById("register");
btn.addEventListener("click", LoginToWebsite);
const Username  = document.getElementById("username");
const password  = document.getElementById("password");
const email     = document.getElementById("email");
email.value = "no-email";
const text      = document.getElementById("login-header");
const original  = text.textContent;
var canPress    = true;

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



        } catch (error) {
            alert('Error:', error);
            canPress = true;
        }
    }
    else
    {
        alert("Everytime you spam a request, i send 500k to israel");
    }
}