import Pusher from "pusher";
//keep secret here only
//never expose!
const PUSHER_APP_ID = env.PUSHER_APP_ID;
const PUSHER_KEY = env.PUSHER_KEY;
const PUSHER_SECRET = env.PUSHER_SECRET;
const PUSHER_CLUSTER = env.PUSHER_CLUSTER;

export default{
    async fetch (request){
        //takes in a request
        if(request.method !== "POST") return new Response("Method is invalid",{status : 405});
        
        //wait for data
        const body = await request.formData();
        const socketId = body.get('socket_id');
        const channelName = body.get('channel_name');
        const displayName = body.get('custom_name');// this is the user display name
        const userId = Math.random().toString(36).substring(7);
        
    }
}