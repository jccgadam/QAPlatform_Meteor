Meteor.setInterval(function(){
    if(SessionAmplify.get('loginUser')){
        var url = "http://54.191.134.26:9000/heartbeat/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
        HTTP.get(url, function(error, response){
            console.log("Heartbeat sent");
        });
    }
}, 10000);

Template.main.helpers({
    notificationCount : function(){
        return Session.get("notificationCount");
    },
    userEmail: function(){
        return JSON.parse(SessionAmplify.get('loginUser').content).email;
    }
});

Template.main.events({
    'click .img-circle' : function (event) {
        if(event.target.id == "questions"){
            Router.go('questions');
        }
    },

    'click .logoutbutton' : function(e){
        var url = "http://54.191.134.26:9000/logoff/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
            HTTP.get(url, function(error, response){
            console.log("Logoff sent");
        });
        Meteor.logout(function(err){});
        $.each(amplify.store(), function (storeKey) {
            amplify.store(storeKey, null);
            SessionAmplify.set(storeKey, null);
        });
        console.log("amplify.store() cleared");
        Router.go('/login');
    },
});

Template.main.onCreated(function () {
    var url = "http://54.191.134.26:9000/userunreadnotificationsN/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
    HTTP.get(url, function (error, response) {
        if (error) {
            Session.set("notificationCount", 0);
        } else {
            var count = JSON.parse(response.content).count;
            if(count <= 2){
                Session.set("notificationCount", count);
            } else {
                Session.set("notificationCount", 3);
            }
        }
    });

    var url2 = "http://54.191.134.26:9000/categories";
    HTTP.get(url2, function (error, response) {
        if(error){
            SessionAmplify.set("categories", null);
        } else{
            var cats = JSON.parse(response.content).results;
            SessionAmplify.set("categories", cats);
        }
    });
});
