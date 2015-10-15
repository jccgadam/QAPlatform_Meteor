Template.questions.helpers({
    questions: function(){
        return Session.get("tmpResult");
    }
});

HTTP.get("http://52.89.233.213:9000/questions", function (error, response) {
    if (error) {
        Template.questions.helpers({
            questions: ""
        });
    }
    else{
        obj = JSON.parse(response.content);
        Session.set("questions", obj);
        Session.set("tmpResult", obj.results);
    }
});

Template.questions.events({
    'click .item, click .button': function (event) {
    console.log(event.target.id);
        if(Number(event.target.id) >= 1){
            for(i = 0; i < Session.get("questions").results.length; i ++){
                if(Session.get("questions").results[i].qId.toString() === event.target.id){
                    Session.set("question", Session.get("questions").results[i]);
                    break;
                }
            }
            Template.questionDetail.helpers({
                q : Session.get("question").title
            });
            Router.go("questionDetail");
        } else if(event.target.id == "searchField"){

        } else if(event.target.id == "cancelSearch"){
            document.getElementById("searchField").value = "";
            Session.set("tmpResult", Session.get("questions").results);
        }
    },

    'keyup .searchField' : function(event){
        if(event.target.id == "searchField"){
            if(document.getElementById("searchField").value == ""){
                Session.set("tmpResult", Session.get("questions").results);
            } else {
                var input = document.getElementById("searchField").value;
                var tmp = [];
                for(i = 0; i < Session.get("questions").results.length; i ++){
                    if(Session.get("questions").results[i].title.toString().indexOf(input) > -1){
                        tmp.push(Session.get("questions").results[i]);
                    }
                }
                Session.set("tmpResult", tmp);
            }
        }
    },
})

