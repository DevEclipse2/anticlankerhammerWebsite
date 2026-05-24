const pusher = new Pusher('YOUR_APP_KEY', {
  cluster: 'YOUR_CLUSTER',
  authEndpoint: '/pusher/auth', // Your server route
  auth: {
    headers: {
      'Authorization': 'Bearer ' + yourAuthToken // If you need to verify the user
    }
  }
});

// Subscribe to a private channel
const channel = pusher.subscribe('private-my-channel');

