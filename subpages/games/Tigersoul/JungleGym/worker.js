const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // this bit is from unity to submit a score
    if (request.method === "POST" && url.pathname === "/submit-score") {
      try {
        let { playerName, time } = await request.json();

        // checks if its an actual number being sent
        if (!playerName || typeof time !== "number") {
          return new Response(JSON.stringify({ error: "Invalid data" }), { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          });
        }

        // no special chars
        playerName = playerName.replace(/[^a-zA-Z0-9_]/g, "");

        if (playerName.trim().length === 0) {
            playerName = "Anonymous";
        } else {
            //purgomalum
            try {
                //safely include player name 
                const filterUrl = `https://www.purgomalum.com/service/json?text=${encodeURIComponent(playerName)}`;
                const filterResponse = await fetch(filterUrl);
                
                if (filterResponse.ok) {
                    const filterData = await filterResponse.json();
                    if (filterData && filterData.result) {
                        playerName = filterData.result; //return string is probably sanitised unless its some ridiculously obscure bs. at this point no human can probably recognise it
                    }
                }
            } catch (error) {
                //if the server is downed, it logs an error but continues to allow players to add records, albeit with more slurs
                console.error("Profanity filter API error:", error);
            }
        }
        // Database shi
        //did i EVER tell you about how much i hate writing in SQL?
        await env.DB.prepare(
          "INSERT INTO scores (player_name, time, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)"
        ).bind(playerName, time).run();

        return new Response(JSON.stringify({ success: true, message: "Score saved!" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
    }

    // this is the webpage calling
    if (request.method === "GET" && url.pathname === "/leaderboard") {
      try {
        // top scorers 
        const { results } = await env.DB.prepare(
          "SELECT player_name, time FROM scores ORDER BY time ASC LIMIT 50"
        ).all();

        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (error) {
         return new Response(JSON.stringify({ error: error.message }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
    }

    // ill add something here later to show rank by submitting username

    // Fallback for unknown routes
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};