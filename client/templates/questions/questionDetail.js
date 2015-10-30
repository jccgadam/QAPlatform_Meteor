  Template.questionDetail.helpers({
  data:function(){
  	return this;
  },
  answers:function(){
    var qId = this.qId;
    // console.log(this.qId);
    var url = "http://54.191.134.26:9000/questionanswers/"+qId;
    console.log(url);
    HTTP.get(url, function (error, response) {
        if (error) {
            SessionAmplify.set("answers", []);
        }
        else{
          var res = response.data.results;
          var results =[];
          var modifiedAnswer;
          _.each(res,function(k){
             if(k.content.length>10)
            {
             modifiedAnswer ={abbr:k.content.substring(0,10),detail:k.content,aId:k.aId}; 
             results.push(modifiedAnswer);
            }
            else{
              modifiedAnswer = {detail:k.content,aId:aId}
              results.push(modifiedAnswer);
            }
          })
             SessionAmplify.set('answers',results);
        }
       
       })     
       
        return SessionAmplify.get('answers');
  }
  })

  Template.questionDetail.events({
   'click .backButton':function(e,t){
    e.preventDefault();
    window.history.back();
    }
  })