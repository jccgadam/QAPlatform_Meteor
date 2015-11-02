Template.main.helpers({
    notificationCount : function(){
        return Session.get("notificationCount");
    }
});

Template.main.events({
    'click .img-circle' : function (event) {
        if(event.target.id == "questions"){
            Router.go('questions');
        }
    },

    'click .logoutbutton' : function(e){
        console.log("Log out button clicked");
        SessionAmplify = null;
        console.log("SessionAmplify cleared");
        Router.go('/');
    }
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
