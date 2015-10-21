Template.questions.helpers({
    questions: function(){
        return Session.get("tmpResult").reverse();
    },
    questionsaskedactive: function(){
        return Session.get("questionsaskedactive");
    }
});

Template.questions.onCreated(function () {
    var url = "http://54.191.134.26:9000/userquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
    HTTP.get(url, function (error, response) {
        if (error) {
            Session.set("tmpResult", []);
        }
        else{
            var obj = JSON.parse(response.content);
            for(var i = 0; i < obj.results.length; i ++){
                var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                obj.results[i].createMonth = createMonth;
                obj.results[i].createDay = obj.results[i].createDate.split("/")[2];
                obj.results[i].displayTitle = obj.results[i].title;
                if(obj.results[i].title.length > 16){
                    obj.results[i].displayTitle = obj.results[i].title.substring(0, 17) + "..";
                }
                obj.results[i].displayContent = obj.results[i].content;
                if(obj.results[i].content.length > 28){
                    obj.results[i].displayContent = obj.results[i].content.substring(0, 29) + "..";
                }
            }
            Session.set("questions", obj);
            Session.set("tmpResult", obj.results);
        }
    });

    var url2 = "http://54.191.134.26:9000/answerquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
    HTTP.get(url2, function (error, response) {
            if (error) {
                        Session.set("tmpResult", []);
            }
            else{
                var obj = JSON.parse(response.content);
                for(var i = 0; i < obj.results.length; i ++){
                    var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                    obj.results[i].createMonth = createMonth;
                    obj.results[i].createDay = obj.results[i].createDate.split("/")[2];
                    obj.results[i].displayTitle = obj.results[i].title;
                    if(obj.results[i].title.length > 16){
                        obj.results[i].displayTitle = obj.results[i].title.substring(0, 17) + "..";
                    }
                    obj.results[i].displayContent = obj.results[i].content;
                    if(obj.results[i].content.length > 28){
                        obj.results[i].displayContent = obj.results[i].content.substring(0, 29) + "..";
                    }
                }
                Session.set("answerQuestions", obj);
            }
        });
    Session.set("questionsaskedactive", true);
})

Template.questions.events({
    'click .item, click .button, click .tab-item': function (event) {
        if(Number(event.target.id) >= 1){
            for(i = 0; i < Session.get("tmpResult").length; i ++){
                if(Session.get("tmpResult")[i].qId.toString() === event.target.id){
                    Session.set("question", Session.get("tmpResult")[i]);
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
            Session.set("tmpResult", Session.get("questionsaskedactive") ? Session.get("questions").results : Session.get("answerQuestions").results);
        } else if(event.target.id == "questionsanswered"){
            document.getElementById("searchField").value = "";
            Session.set("questionsaskedactive", false);
            Session.set("tmpResult", Session.get("answerQuestions").results);
        } else if(event.target.id == "questionsasked"){
            document.getElementById("searchField").value = "";
            Session.set("questionsaskedactive", true);
            Session.set("tmpResult", Session.get("questions").results);
        }
    },

    'keyup .searchField' : function(event){
        if(event.target.id == "searchField"){
            if(document.getElementById("searchField").value == ""){
                Session.set("tmpResult", Session.get("questionsaskedactive") ? Session.get("questions").results : Session.get("answerQuestions").results);
            } else {
                var input = document.getElementById("searchField").value;
                var tmp = [];
                for(i = 0; i < Session.get("tmpResult").length; i ++){
                    if(Session.get("tmpResult")[i].title.toString().indexOf(input) > -1){
                        tmp.push(Session.get("tmpResult")[i]);
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
