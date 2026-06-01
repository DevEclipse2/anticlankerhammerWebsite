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
        
        //checks if requests come from MY website
        if (url.href.indexOf(allowedPath)!= -1) {



            const { username,email,password} = await request.json();
            var reg_email = !(email == "no-email");
            //run email format checks
            //hash the email
            const salt = crypto.getRandomValues(new Uint8Array(16));
            if(reg_email)
            {
                try {
                    await env.DB.prepare('INSERT INTO users (username,email, hash , salt) VALUES (?1, ?2, ?3, ?4)')
                        .bind(username, email,password,salt)
                        .run();
                        return new Response("user added successfully!", { status: 201 });
                } catch (e) 
                {
                    return new Response(e.message, { status: 500 });
                }
            }
            else
            {
                try 
                {
                    await env.DB.prepare('INSERT INTO users (username, hash , salt) VALUES (?1, ?2, ?3)')
                        .bind(username, password, salt)
                        .run();
                        return new Response("user added successfully!", { status: 201 });
                } catch (e) 
                {
                    return new Response(e.message, { status: 500 });
                }
            }
        }
        return new Response(JSON.stringify({ error: "Access Denied" }), {
        status: 403,
        headers: corsHeaders,
        });
    },
}