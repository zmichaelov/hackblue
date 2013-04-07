/**
 Initializes Facebook SDK and Graph API
 */
GLOBALS = {};
function login() {
    console.log("attempting login")
    FB.login(function (response) {
        console.log("login response", response);
            if (response.authResponse) {
                // connected
                console.log("successfully logged in!");
            } else {
                // cancelled
                console.log("login cancelled");
            }
        },
        // Permissions we want
        {scope: 'user_groups ,user_likes, user_relationships, user_subscriptions,' +
            'user_photos, friends_actions.news, read_stream'}
    );
}
window.fbAsyncInit = function () {
    console.log("begin fb sync")
    // init the FB JS SDK

    FB.init({
        appId: '294552144009726',                        // App ID from the app dashboard
        status: true,                                 // Check Facebook Login status
        cookie: true,           // enable cookies to allow the server to access the session
        xfbml: true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
    var loginStatus = FB.getLoginStatus(function (response) {
        console.log("Login status", response)
        if (response.status === 'connected') {
            // connected
            console.log("Connected!");
            GLOBALS.accessToken = response.authResponse.accessToken;
            init();
            animate();
        } else if (response.status === 'not_authorized') {
            // not_authorized
            console.log("Not authorized");
            login();
        } else {
            // not_logged_in
            console.log("Not logged in");
            login();
        }
    });
};