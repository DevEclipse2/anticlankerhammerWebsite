//copied from cloudflare worker editor

import Pusher from "pusher";

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
        
        if(request.message == "new-room")
        {
            
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
};