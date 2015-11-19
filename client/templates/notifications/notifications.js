Template.notifications.helpers({
    notifications: function(){
        return SessionAmplify.get("nTmpResult").reverse();
    },
});

Template.notifications.onCreated(function () {
    var url = "http://54.191.134.26:9000/usernotifications/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
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
                    if(obj.results[i].qTitle.length > 16){
                       obj.results[i].displayQTitle = obj.results[i].qTitle.substring(0, 17) + "..";
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
                       obj.results[i].url = "http://54.191.134.26:3000/chat/" + obj.results[i].comment;
                    }
                    if(obj.results[i].status == "Read"){
                        obj.results[i].bgColor = "light";
                    }
                    tmpResult.push(obj.results[i]);
            }
        }
        SessionAmplify.set("nTmpResult", tmpResult);
    });
});

Template.notifications.events({
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

        var url = "http://54.191.134.26:9000/updatenotifications/" + event.target.id;
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
        var url = "http://54.191.134.26:9000/removenotifications/" + nId;
        HTTP.get(url, function(){});
    },

    'click .backButton':function(e,t){
        e.preventDefault();
        Router.go('main');
    }
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