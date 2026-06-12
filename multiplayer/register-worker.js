export default {
  async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const allowedPath = ".anticlankerhammer.org";
        const allowedOrigin = request.headers.get("Origin") || "*";//everything allowed in, except we don't
        const corsHeaders = {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
        };
        if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
        }



        if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
        

        const requestOrigin = request.headers.get("Origin") || "";
        const isFromRealWebsite = requestOrigin.endsWith(".anticlankerhammer.org");

        //checks if requests come from MY website
        if (isFromRealWebsite) {



            try{
                const { username,email,password} = await request.json();
                const reg_email = !(email == "no-email");

                const usernameRegex = /^[a-zA-Z0-9_-]+$/;

                if (!usernameRegex.test(username)) {
                    return new Response(JSON.stringify({ error: "bastard" }), { 
                        status: 400, 
                        headers: corsHeaders 
                    });
                }
                if (!username || !password) {
                    return new Response(JSON.stringify({ error: "Missing username or password" }), { 
                        status: 400, headers: corsHeaders 
                    });
                }
                //run email format checks
                //hash the email
                const saltArray = crypto.getRandomValues(new Uint8Array(16));
                const saltHex = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
                if(reg_email)
                {
                    await env.DB.prepare('INSERT INTO users (username,email, hash , salt) VALUES (?1, ?2, ?3, ?4)')
                        .bind(username, email,password,saltHex)
                        .run();
                }
                else
                {
                    await env.DB.prepare('INSERT INTO users (username, hash , salt) VALUES (?1, ?2, ?3)')
                        .bind(username, password, saltHex)
                        .run();
                }
                return new Response(JSON.stringify({ message: "user added successfully!" }), { 
                    status: 201,
                    headers: corsHeaders
                });

            }
            catch(e)
            {
                return new Response(JSON.stringify({ 
                    error: "unknown error", 
                    details: e.message 
                }), { 
                    status: 500,
                    headers: corsHeaders
                });
            }
        }
        else
        {
            return new Response(JSON.stringify({ error: "Access Denied" }), {
            status: 403,
            headers: corsHeaders,});
        }
        
        
    },
}