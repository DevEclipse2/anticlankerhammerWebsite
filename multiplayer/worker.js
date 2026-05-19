import Pusher from "pusher";

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const url = new URL(request.url);
      
      // Initialize Pusher with environment variables set in Cloudflare
      const pusher = new Pusher({
        appId: env.PUSHER_APP_ID,
        key: env.PUSHER_KEY,
        secret: env.PUSHER_SECRET,
        cluster: env.PUSHER_CLUSTER,
        useTLS: true,
      });

      if (url.pathname === "/auth") {
        // Parse incoming body from Pusher Client (contains socket_id and channel_name)
        const formData = await request.formData();
        const socketId = formData.get("socket_id");
        const channelName = formData.get("channel_name");
        
        // Generate a random User ID and player metadata
        const userId = "user-" + Math.random().toString(36).substr(2, 9);
        const playerPresenceData = {
          user_id: userId,
          user_info: {
            name: `Player_${Math.floor(Math.random() * 1000)}`,
          },
        };

        // Authorize the presence channel connection
        const authResponse = pusher.authorizeChannel(socketId, channelName, playerPresenceData);

        return new Response(JSON.stringify(authResponse), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Configure this to your domain in production
          },
        });
      }

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  },
};