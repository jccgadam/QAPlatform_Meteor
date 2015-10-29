  Template.questionDetail.helpers({
  data:function(){
  	return this;
  },
  answers:function(){
    var qId = this.qId;
    // console.log(this);
    var url = "http://54.191.134.26:9000/answers/1";
    
    HTTP.get(url, function (error, response) {
        if (error) {
            SessionAmplify.set("answers", []);
        }
        else{
          // console.log(response.data);
          var answer = response.data.content;
          var modifiedAnswer;
          if(answer.length>10)
            {
             modifiedAnswer ={abbr:answer.substring(0,10),detail:answer}; 
            }
             SessionAmplify.set('answers',modifiedAnswer);
            // var obj = JSON.parse(response.content);
            // var createMonth = monthNumberToString(obj.createDate.split("/")[1]);
            // obj.createMonth = createMonth;
            // obj.createDay = obj.createDate.split("/")[2];
            // obj.displayTitle = obj.title;
            // if(obj.title.length > 16){
            //         obj.displayTitle = obj.title.substring(0, 17) + "..";
            //     }
            //     obj.displayContent = obj.content;
            //     if(obj.content.length > 28){
            //         obj.displayContent = obj.content.substring(0, 29) + "..";
            //     }
            //  SessionAmplify.set('obj',obj);       
        }
       
       })     
        console.log(SessionAmplify.get('answers'));
        return SessionAmplify.get('answers');
  }
  })

  Template.questionDetail.events({
   'click .backButton':function(e,t){
    e.preventDefault();
    window.history.back();
    }
  })