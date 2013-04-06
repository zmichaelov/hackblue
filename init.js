/**
 Initializes Facebook SDK and Graph API
 */

function login() {
    FB.login(function (response) {
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
    // init the FB JS SDK
    FB.init({
        appId: '294552144009726',                        // App ID from the app dashboard
        status: true,                                 // Check Facebook Login status
        xfbml: true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
    var loginStatus = FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // connected
            console.log("Connected!");
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

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));