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

        if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
        
        const { username,email,password} = await request.json();
        var reg_email = !(email == "no-email");
        //run email format checks
    },
}