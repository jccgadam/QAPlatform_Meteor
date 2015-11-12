  Template.questionDetail.helpers({
  data:function(){
     
    console.log(this);
  	return this;
  },
  cameraImages:function(){
     SessionAmplify.set('uuid',this.UUID)
      var uuid = SessionAmplify.get('uuid');
     Meteor.call('cameraImages',uuid,function(err,res){
       if(err){

       }
       else if (res)
       {  
          SessionAmplify.set('cameraImagesList',res)
       }      
     })
     return SessionAmplify.get('cameraImagesList');
  },
  uuid:function(){

    return SessionAmplify.get('uuid');

  },
  answers:function(){
    var qId = this.qId;
    var url = "http://54.191.134.26:9000/questionanswers/"+qId;
    HTTP.get(url, function (error, response) {
        if (error) {
            SessionAmplify.set("answers", []);
        }
        else{
          var res = response.data.results;
          var results =[];
          var modifiedAnswer;
          _.each(res,function(k){
             if(k.content.length>22)
            {
             modifiedAnswer ={abbr:k.content.substring(0,22),detail:k.content,aId:k.aId}; 
             results.push(modifiedAnswer);
            }
            else{
              modifiedAnswer = {detail:k.content,aId:k.aId}
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