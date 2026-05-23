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
    
    const { username, password } = await request.json();
    
    //read D1 here
    const user = await env.DB.prepare("SELECT * FROM user_id WHERE username = ?")
      .bind(username).first();

    if (!user) return new Response('Error : No user with associated name found in database', { status: 401 });

    //hash and compare
    const salt = Uint8Array.from(atob(user.salt), c => c.charCodeAt(0));
    const inputHash = await hashPassword(password, salt);

    //ripped from cloudflare examples
    const lengthsMatch = user.hash.byteLength === inputHash.byteLength;
    const isEqual = lengthsMatch
      ? crypto.subtle.timingSafeEqual(user.hash, inputHash)
      : !crypto.subtle.timingSafeEqual(user.hash, user.hash);

    if (!isEqual) {
      return new Response("Unauthorized", { status: 401 });
    }


    //payload from the hit videogame team fortress 2 made by valve playable only on the orange box
    const payload = {
        sub: user.id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8) // 8 hour expiry
        //if your ass doesnt touch enough grass in 8 hours it no longer works womp womp
    };

  // token, like the guy who wrote lord of the rings
  const token = await signJWT(payload, env.JWT_SECRET);

  //i just hit the jackPOOOOOOOOT
  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers: {
      "Set-Cookie": `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
      "Content-Type": "application/json"
    }
  });

    //things to take into account
    // salt and hash passwords
    //prevent timing attacks

    //number one, receive user id 
    //receive password hash
    //query database for user and password

  },
}
//hasher
const encoder = new TextEncoder();

async function hashPassword(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
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