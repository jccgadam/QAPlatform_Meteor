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
})