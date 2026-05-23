//this is the worker


export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const allowedPath = ".anticlankerhammer.org";
    const allowedOrigin = "*"; //everything allowed in, except we don't
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Content-Type": "application/json",
    };

    //this is part of the allowed path
    if (url.href.indexOf(allowedPath)!= -1) {
        
        if(request.o == "join")
        {
            joinRoom();
        }
        return new Response(JSON.stringify({ message: "Access granted" }), {
        status: 200,
        headers: corsHeaders,
        });
    }
    return new Response(JSON.stringify({ error: "Access Denied" }), {
      status: 403,
      headers: corsHeaders,
    });
  },
  async scheduled(controller, env, ctx) {
    // Perform your task here
    console.log(`Cron trigger fired: ${controller.cron}`);
    
    // Use ctx.waitUntil to ensure task finish
    ctx.waitUntil(roomCheck());
  }, 
}
async function roomCheck() {
// if last request is more than 3 minutes ago,it shuts down and kicks all users in the channel.
}
async function createRoom   (){
  
}
async function joinRoom     ()
{
    //first queries database

}
async function leaveRoom    (){}