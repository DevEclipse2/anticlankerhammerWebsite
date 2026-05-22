const PUSHER_CLUSTER = env.PUSHER_CLUSTER;

export default{
    async fetch (request){
        //takes in a request
        if(request.method !== "POST"){ return new Response("Method is invalid",{status : 405});}
        else
        {
            return new Response("hello again dumbbell!");

        }
        
    }
}