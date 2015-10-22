Template.notifications.helpers({
    notifications: function(){
        return Session.get("tmpResult").reverse();
    },
});

Template.notifications.onCreated(function () {
    var url = "http://54.191.134.26:9000/usernotifications/" + JSON.parse(SessionAmplify.get('loginUser').content).uId;
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
                obj.results[i].displayQTitle = obj.results[i].qTitle;
                if(obj.results[i].qTitle.length > 16){
                    obj.results[i].displayQTitle = obj.results[i].qTitle.substring(0, 17) + "..";
                }
                if(obj.results[i].type = "NEWQUESTION"){
                    obj.results[i].title = "New question for you"
                } else if(obj.results[i].type = "NEWANSWER") {
                    obj.results[i].title = "There is a new answer for your question"
                } else {
                    obj.results[i].title = "Your answer has been chosen as the best!"
                }
            }
        }
        Session.set("tmpResult", obj.results);
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