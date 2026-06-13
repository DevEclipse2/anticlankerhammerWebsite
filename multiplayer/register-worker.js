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
                if (!username || !password) {
                    return new Response(JSON.stringify({ error: "Missing username or password" }), { 
                        status: 400, headers: corsHeaders 
                    });
                }
                if (!usernameRegex.test(username)) {
                    return new Response(JSON.stringify({ error: "bastard" }), { 
                        status: 400, 
                        headers: corsHeaders 
                    });
                }
                //run email format checks
                //hash the password
                const saltArray = crypto.getRandomValues(new Uint8Array(16));
                const saltHex = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
                const secureHash = await hashPassword(password,saltArray);
                if(reg_email)
                {
                    await env.DB.prepare('INSERT INTO users (username,email, hash , salt) VALUES (?1, ?2, ?3, ?4)')
                        .bind(username, email,secureHash,saltHex)
                        .run();
                }
                else
                {
                    await env.DB.prepare('INSERT INTO users (username, hash , salt) VALUES (?1, ?2, ?3)')
                        .bind(username, secureHash, saltHex)
                        .run();
                }
                return new Response(JSON.stringify({ message: "user added successfully!" }), { 
                    status: 201,
                    headers: corsHeaders
                });
            }
            catch(e)
            {
                if(e.message.includes("UNIQUE constraint failed"))
                {
                    return new Response(JSON.stringify({ 
                    error: "email taken", 
                    details: "account with same email already exists. Either sign in or peace out."
                }), { 
                    status: 409,
                    headers: corsHeaders
                });
                }
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
 async function hashPassword(password, saltArray)
{
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    

    // Import the password as a base key
    const importedKey = await crypto.subtle.importKey(
        "raw", 
        passwordBuffer, 
        { name: "PBKDF2" }, 
        false, 
        ["deriveBits"]
    );

    // Run the PBKDF2 algorithm 
    const hashBuffer = await crypto.subtle.deriveBits(
        //tooo particular (>100000) are not supported
        { name: "PBKDF2", salt: saltArray, iterations: 100000, hash: "SHA-256" },
        importedKey, 
        256
    );

    // Convert the final secure hash into a Hex string for database storage
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}