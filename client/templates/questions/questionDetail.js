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

  answerCount: function(){
    return Session.get("answerCount");
  },

  categories: function(){
    var categories = [];
    for(var i = 0; i < this.cIds.length; i ++){
        for(var j = 0; j < SessionAmplify.get("categories").length; j ++){
            if(this.cIds[i] == SessionAmplify.get("categories")[j].cId){
                categories.push(SessionAmplify.get("categories")[j].cName);
                break;
            }
        }
    }
    return categories;
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
          Session.set("answerCount", res.length);
          var results =[];
          var modifiedAnswer;
          _.each(res,function(k){
            var answererId = k.u;

             if(k.content.length>22)
            {
             modifiedAnswer ={abbr:k.content.substring(0,22), detail:k.content, aId:k.aId, isBest: k.isBest, hasImage: k.hasImage, hasVoice: k.hasVoice, createDate: k.createDate.substring(1, k.createDate.length), answerer: k.uEmail};
             results.push(modifiedAnswer);
            }
            else{
              modifiedAnswer = {detail:k.content, aId:k.aId, isBest: k.isBest, hasImage: k.hasImage, hasVoice: k.hasVoice, createDate: k.createDate.substring(1, k.createDate.length), answerer: k.uEmail};
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