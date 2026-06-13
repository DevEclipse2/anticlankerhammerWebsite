//oh yeah in case i forget
//  UPDATING THIS DOES NOT UPDATE THE WORKER 
// I HAVE TO MANUALLY COPY N PASTE IT



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
    if (isFromRealWebsite) 
    {
      const { username, password } = await request.json();
      
      if (!password || password.trim() === "") {
          return new Response(JSON.stringify({ error: "Password cannot be empty" }), { 
              status: 400, 
              headers: corsHeaders 
          });
      }
      if (!username || username.trim() === "") {
          return new Response(JSON.stringify({ error: "username cannot be empty" }), { 
              status: 400,
              headers: corsHeaders 
          });
      }

      //read D1 here
      const user = await env.DB.prepare("SELECT * FROM users WHERE username = ?")
        .bind(username).first();

      if (!user) return new Response(JSON.stringify({ error : "No user with associated name found in database"}), { status: 401, headers: corsHeaders });
      console.log(user.hash);
      console.log(user.salt);
      console.log(password);

      //hash and compare
      const textencoder = new TextEncoder();
      const salt = new Uint8Array(user.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const inputHash = await hashPassword(password, salt);
      //convert inputhash into uint8array
      const inputHex = textencoder.encode(inputHash);
      const userhash = textencoder.encode(user.hash);
      //ripped from cloudflare examples
      const lengthsMatch = user.hash.byteLength === inputHex.byteLength;
      const isEqual = lengthsMatch
        ? crypto.subtle.timingSafeEqual(userhash, inputHex)
        : !crypto.subtle.timingSafeEqual(userhash, userhash);

      if (!isEqual) {
        return new Response(JSON.stringify({ error: "Unauthorised" }), { status: 401, headers: corsHeaders });
      }


      //payload from the hit videogame team fortress 2 made by valve playable only on the orange box
      const payload = {
          sub: user.user_id.toString(),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8) // 8 hour expiry
          //if your ass doesnt touch enough grass in 8 hours it no longer works womp womp
      };

      // token, like the guy who wrote lord of the rings
      const token = await signJWT(payload, env.JWT_SECRET);

      //i just hit the jackPOOOOOOOOT
      return new Response(JSON.stringify({ message: "Login successful", sessiontoken: token}), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
        }
      });

      //things to take into account
      // salt and hash passwords ✅
      //prevent timing attacks ✅
      //number one, receive user id 
      //receive password
      //query database for user and password
    }
  return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403,  headers: corsHeaders,});
  },
}
//hasher
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
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function signJWT(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = btoa(JSON.stringify(payload));
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(`${header}.${data}`));
  
  // Convert signature to Base64URL
  const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
  return `${header}.${data}.${sigBase64}`;
}