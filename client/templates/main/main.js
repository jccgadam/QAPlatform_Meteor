Meteor.setInterval(function(){
    if(SessionAmplify.get('loginUser')){
        var url = "http://52.34.229.35:9000/heartbeat/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
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
    },

    homeActive: function(){
        return SessionAmplify.get("idHome");
    },

    questionsActive: function(){
        return SessionAmplify.get("idQuestions");
    },

    notificationsActive: function(){
        return SessionAmplify.get("idNotifications");
    },

    questions: function(){
        return SessionAmplify.get("tmpResult").reverse();
    },

    questionsaskedactive: function(){
        return SessionAmplify.get("questionsaskedactive");
    },

    notifications: function(){
        return SessionAmplify.get("nTmpResult").reverse();
    },

    subscribedQuestions: function(){
        return SessionAmplify.get("tmpSubscribedResult");
    }
});

Template.main.events({
    'click .img-circle' : function (event) {
        if(event.target.id == "questions"){
            Router.go('questions');
        }
    },

    'click .pull-left': function(event){
        if(event.target.id == "userProfile"){
            Router.go('userProfile');
        }
    },

    'click .logoutbutton' : function(e){
        var url = "http://52.34.229.35:9000/logoff/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
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

    'click .askQuestion' : function(event){
        Router.go('questionsPost');
    },

    'click .homeTab': function (event) {
        if(event.target.id == "idHome"){
            SessionAmplify.set("idHome", true);
            SessionAmplify.set("idQuestions", false);
            SessionAmplify.set("idNotifications", false);
            var url3 = "http://52.34.229.35:9000/subscribedquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
            HTTP.get(url3, function (error, response) {
                    if (error) {
                        SessionAmplify.set("subscribedResult", []);
                    }
                    else{
                        var obj = JSON.parse(response.content);
                        for(var i = 0; i < obj.results.length; i ++){
                            var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                            obj.results[i].createMonth = createMonth;
                            obj.results[i].createDay = obj.results[i].createDate.split("/")[2];

                            //Get categories names for each question
                            var cats = [];
                            for(var k = 0; k < obj.results[i].cIds.length; k ++){
                                for(var j = 0; j < SessionAmplify.get("categories").length; j ++){
                                    if(obj.results[i].cIds[k] == SessionAmplify.get("categories")[j].cId){
                                        cats.push(SessionAmplify.get("categories")[j].cName);
                                        break;
                                    }
                                }
                            }
                            obj.results[i].catNames = cats;
                        }
                        SessionAmplify.set("subscribedResult", obj.results);
                        SessionAmplify.set("tmpSubscribedResult", obj.results);
                    }
                });
        } else if(event.target.id == "idQuestions"){
            SessionAmplify.set("idHome", false);
            SessionAmplify.set("idQuestions", true);
            SessionAmplify.set("idNotifications", false);
            var url = "http://52.34.229.35:9000/userquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
            HTTP.get(url, function (error, response) {
                if (error) {
                    SessionAmplify.set("tmpResult", []);
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

                        //Get categories names for each question
                        var cats = [];
                        for(var k = 0; k < obj.results[i].cIds.length; k ++){
                            for(var j = 0; j < SessionAmplify.get("categories").length; j ++){
                                if(obj.results[i].cIds[k] == SessionAmplify.get("categories")[j].cId){
                                    cats.push(SessionAmplify.get("categories")[j].cName);
                                    break;
                                }
                            }
                        }
                        obj.results[i].catNames = cats;
                    }
                    SessionAmplify.set("questions", obj);
                    if(SessionAmplify.get("questionsaskedactive")){
                        SessionAmplify.set("tmpResult", obj.results);
                    }
                }
            });

            var url2 = "http://52.34.229.35:9000/answerquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
            HTTP.get(url2, function (error, response) {
                    if (error) {
                                SessionAmplify.set("tmpResult", []);
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
                        SessionAmplify.set("answerQuestions", obj);
                        if(!SessionAmplify.get("questionsaskedactive")){
                            SessionAmplify.set("tmpResult", obj.results);
                        }
                    }
                });
        } else {
            SessionAmplify.set("idHome", false);
            SessionAmplify.set("idQuestions", false);
            SessionAmplify.set("idNotifications", true);
            var url = "http://52.34.229.35:9000/usernotifications/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
            var tmpResult = [];
            HTTP.get(url, function (error, response) {
                if (error) {
                    SessionAmplify.set("nTmpResult", []);
                }
                else{
                    var obj = JSON.parse(response.content);
                    for(var i = 0; i < obj.results.length; i ++){
                            var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                            obj.results[i].createMonth = createMonth;
                            obj.results[i].createDay = obj.results[i].createDate.split("/")[2];
                            obj.results[i].displayQTitle = obj.results[i].qTitle;
                            if(obj.results[i].qTitle.length > 24){
                               obj.results[i].displayQTitle = obj.results[i].qTitle.substring(0, 25) + "..";
                            }
                            if(obj.results[i].type == "NEWQUESTION"){
                               obj.results[i].title = "Got a new question";
                               obj.results[i].bgColor = "balanced";
                               obj.results[i].url = "/question/" + obj.results[i].qId;
                            } else if(obj.results[i].type == "NEWANSWER") {
                               obj.results[i].title = "Got an answer!";
                               obj.results[i].bgColor = "calm";
                               obj.results[i].url = "/question/" + obj.results[i].qId;
                            } else if(obj.results[i].type == "BESTANSWER") {
                               obj.results[i].title = "Chosen as the best!";
                               obj.results[i].bgColor = "energized";
                               obj.results[i].url = "/question/" + obj.results[i].qId;
                            } else if(obj.results[i].type == "CHAT"){
                               obj.results[i].title = "Chatting request";
                               obj.results[i].bgColor = "royal";
                               obj.results[i].url = "http://52.34.229.35:3000/chat/" + obj.results[i].comment;
                            } else if(obj.results[i].type == "VIDEO"){
                               obj.results[i].title = "Video chat request";
                               obj.results[i].bgColor = "assertive";
                               obj.results[i].url = "http://52.34.229.35:3000/room/" + obj.results[i].comment;
                            }
                            if(obj.results[i].status == "Read"){
                                obj.results[i].bgColor = "light";
                            }
                            tmpResult.push(obj.results[i]);
                    }
                }
                SessionAmplify.set("nTmpResult", tmpResult);
            });
        }
    },
    'click .button, click .tab-item': function (event) {
        if(Number(event.target.id) >= 1){
            for(i = 0; i < SessionAmplify.get("tmpResult").length; i ++){
                if(SessionAmplify.get("tmpResult")[i].qId.toString() === event.target.id){
                    SessionAmplify.set("question", SessionAmplify.get("tmpResult")[i]);
                    break;
                }
            }
            Template.questionDetail.helpers({
                q : SessionAmplify.get("question").title
            });
            Router.go("questionDetail");
        } else if(event.target.id == "searchField"){

        } else if(event.target.id == "cancelSearch"){
            document.getElementById("searchField").value = "";
            SessionAmplify.set("tmpResult", SessionAmplify.get("questionsaskedactive") ? SessionAmplify.get("questions").results : SessionAmplify.get("answerQuestions").results);
        } else if(event.target.id == "questionsanswered"){
            document.getElementById("searchField").value = "";
            SessionAmplify.set("questionsaskedactive", false);
            SessionAmplify.set("tmpResult", SessionAmplify.get("answerQuestions").results);
        } else if(event.target.id == "questionsasked"){
            document.getElementById("searchField").value = "";
            SessionAmplify.set("questionsaskedactive", true);
            SessionAmplify.set("tmpResult", SessionAmplify.get("questions").results);
        } else if(event.target.id == "cancelSearchMain"){
            document.getElementById("searchFieldMain").value = "";
            SessionAmplify.set("tmpSubscribedResult", SessionAmplify.get("subscribedResult"));
        } else if(event.target.id.substring(4, event.target.id.length) >= 1){
            for(i = 0; i < SessionAmplify.get("tmpSubscribedResult").length; i ++){
                    if(SessionAmplify.get("tmpSubscribedResult")[i].qId.toString() === event.target.id.substring(4, event.target.id.length)){
                        SessionAmplify.set("question", SessionAmplify.get("tmpSubscribedResult")[i]);
                        break;
                    }
                }
                Template.questionDetail.helpers({
                    q : SessionAmplify.get("question").title
                });
                Router.go("questionDetail");
        }
    },
    'keyup .searchField' : function(event){
        if(event.target.id == "searchField"){
            var qs = SessionAmplify.get("questionsaskedactive") ? SessionAmplify.get("questions").results : SessionAmplify.get("answerQuestions").results;
            if(document.getElementById("searchField").value == ""){
                SessionAmplify.set("tmpResult", qs);
            } else {
                var input = document.getElementById("searchField").value;
                var tmp = [];
                for(i = 0; i < qs.length; i ++){
                    if(qs[i].title.toString().toLowerCase().indexOf(input.toLowerCase()) > -1){
                        tmp.push(qs[i]);
                    }
                }
                SessionAmplify.set("tmpResult", tmp);
            }
        } else if(event.target.id == "searchFieldMain"){
            if(document.getElementById("searchFieldMain").value == ""){
                SessionAmplify.set("tmpSubscribedResult", SessionAmplify.get("subscribedResult"));
            } else {
                var input = document.getElementById("searchFieldMain").value;
                var tmp = [];
                for(i = 0; i < SessionAmplify.get("subscribedResult").length; i ++){
                    if(SessionAmplify.get("subscribedResult")[i].title.toString().toLowerCase().indexOf(input.toLowerCase()) > -1){
                        tmp.push(SessionAmplify.get("subscribedResult")[i]);
                    }
                }
                SessionAmplify.set("tmpSubscribedResult", tmp);
            }
        }
    },

    'click .notification-desc-header': function(event){
        var tmp;
        var index;
        for(var i = 0; i < SessionAmplify.get("nTmpResult").length; i ++){
            if(SessionAmplify.get("nTmpResult")[i].nId == Number(event.target.id)){
                index = i;
                tmp = SessionAmplify.get("nTmpResult")[i];
                break;
            }
        }
        var tmpArray = SessionAmplify.get("nTmpResult");
        tmp.bgColor = "light";
        tmpArray.splice(index, 1);
        tmpArray.splice(index, 0, tmp);
        SessionAmplify.set("nTmpResult", tmpArray);

        var url = "http://52.34.229.35:9000/updatenotifications/" + event.target.id;
        HTTP.get(url, function(){});
    },

    'click .ion-close-round': function(event){
        var nId = Number(event.target.id.substring(2, event.target.id.length));
        var index;
        for(var i = 0; i < SessionAmplify.get("nTmpResult").length; i ++){
            if(SessionAmplify.get("nTmpResult")[i].nId == nId){
                index = i;
                break;
            }
        }
        var tmpArray = SessionAmplify.get("nTmpResult");
        tmpArray.splice(index, 1);
        SessionAmplify.set("nTmpResult", tmpArray);
        var url = "http://52.34.229.35:9000/removenotifications/" + nId;
        HTTP.get(url, function(){});
    },
});

Template.main.onCreated(function () {
    var url2 = "http://52.34.229.35:9000/categories";
    HTTP.get(url2, function (error, response) {
        if(error){
            SessionAmplify.set("categories", null);
        } else{
            var cats = JSON.parse(response.content).results;
            SessionAmplify.set("categories", cats);
            if(typeof SessionAmplify.get("idHome") == undefined || SessionAmplify.get("idHome") == null){
                SessionAmplify.set("idHome", true);
                SessionAmplify.set("idQuestions", false);
                SessionAmplify.set("idNotifications", false);
                var url3 = "http://52.34.229.35:9000/subscribedquestions/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
                HTTP.get(url3, function (error, response) {
                        if (error) {
                            SessionAmplify.set("subscribedResult", []);
                        }
                        else{
                            var obj = JSON.parse(response.content);
                            for(var i = 0; i < obj.results.length; i ++){
                                var createMonth = monthNumberToString(obj.results[i].createDate.split("/")[1]);
                                obj.results[i].createMonth = createMonth;
                                obj.results[i].createDay = obj.results[i].createDate.split("/")[2];

                                //Get categories names for each question
                                var cats = [];
                                for(var k = 0; k < obj.results[i].cIds.length; k ++){
                                    for(var j = 0; j < SessionAmplify.get("categories").length; j ++){
                                        if(obj.results[i].cIds[k] == SessionAmplify.get("categories")[j].cId){
                                            cats.push(SessionAmplify.get("categories")[j].cName);
                                            break;
                                        }
                                    }
                                }
                                obj.results[i].catNames = cats;
                            }
                            SessionAmplify.set("subscribedResult", obj.results);
                            SessionAmplify.set("tmpSubscribedResult", obj.results);
                        }
                });
            }
        }
    });

    if(typeof SessionAmplify.get("questionsaskedactive") == undefined || SessionAmplify.get("questionsaskedactive") == null){
        SessionAmplify.set("questionsaskedactive", true);
    }

    var url = "http://52.34.229.35:9000/userunreadnotificationsN/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
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