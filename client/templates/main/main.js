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

    'click .pull-right' : function(e){
        SessionAmplify = null;
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
});
