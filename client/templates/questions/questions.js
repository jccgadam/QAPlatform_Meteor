Template.questions.helpers({
    questions: function(){
        return Session.get("tmpResult").reverse();
    }
});

Template.questions.onCreated(function () {
    var url = "http://52.89.233.213:9000/userquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
    HTTP.get(url, function (error, response) {
        if (error) {
            Template.questions.helpers({
                questions: ""
            });
        }
        else{
            obj = JSON.parse(response.content);
            var tmpArray = [];
            for(var i = 0; i < obj.results.length; i ++){
                var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                obj.results[i].createMonth = createMonth;
                obj.results[i].createDay = obj.results[i].createDate.split("/")[2];
                obj.results[i].displayTitle = obj.results[i].title;
                if(obj.results[i].title.length > 18){
                    obj.results[i].displayTitle = obj.results[i].title.substring(0, 19) + "..";
                }
                obj.results[i].displayContent = obj.results[i].content;
                if(obj.results[i].content.length > 32){
                    obj.results[i].displayContent = obj.results[i].content.substring(0, 33) + "..";
                }
            }
            Session.set("questions", obj);
            Session.set("tmpResult", obj.results);
        }
    });
})

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

function monthNumberToString(createMonth){
    switch(Number(createMonth)) {
        case 1:
            return "Jan";
            break;
        case 2:
            return "Feb";
            break;
        case 3:
            return "Mar";
            break;
        case 4:
            return "Apr";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "Jun";
            break;
        case 7:
            return "Jul";
            break;
        case 8:
            return "Aug";
            break;
        case 9:
            return "Sep";
            break;
        case 10:
            return "Oct";
            break;
        case 11:
            return "Nov";
            break;
        case 12:
            return "Dec";
            break;
        default:
            return "Jan";
    }
}
