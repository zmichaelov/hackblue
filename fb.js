/**
    fb.js
    Facebook functions for pulling data
 */

function getFriends() {
    FB.api('/me/friends', function (response) {
        var friends_list = response.data;
        console.log("# of friends: " + friends_list.length);
    });
}

function getPhotos(){
    FB.api('/me/photos', function (response) {
        var photosList = response.data;
        console.log("# of photos: " + photosList.length);
    });
}

function getNewsFeed(){
    FB.api('me/home', function(response){
        var feed = response.data;
        console.log(feed[0].message);
    });
}

