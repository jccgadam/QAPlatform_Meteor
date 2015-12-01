 Template.answerDetail.helpers({
  data:function(){
   
  	return this;
  },
  owns:function(){
    var uId = SessionAmplify.get('loginUser').data.uId;
    var qUId = SessionAmplify.get("questionDetail").uId;
    return uId === qUId;
  },
  isOpen:function(){
    return SessionAmplify.get("questionDetail").isOpen;
  },
  uuid:function(){
  	return SessionAmplify.get('uuid');
  },
  fId:function(){
  	return SessionAmplify.get('loginUser').data.uId;
  },
  tId:function(){
  	return this.u;
  },
  videoRoomId: function(){
  	return SessionAmplify.get("videoRoomId");
  },

  answererIsOnline: function(){
    return SessionAmplify.get("answererIsOnLine");
  },

  cameraImages:function(){
   
      var auuid = this.aUUID;
     Meteor.call('cameraImages',auuid,function(err,res){
       if(err){
           console.log('error');
       }
       else if (res)
       {  
          SessionAmplify.set('aCameraImagesList',res)
       }      
     })
     return SessionAmplify.get('aCameraImagesList');
  },
  images:function(){
    var aUUID = this.aUUID;
      if(aUUID){
          Meteor.call('Images',aUUID,function(err,res){
            SessionAmplify.set('aImages',res)
          });
          return SessionAmplify.get('aImages');
      }
  },

  hasImage: function(){
    return SessionAmplify.get('aImages') || SessionAmplify.get('aCameraImagesList');
  }
   });

 Template.answerDetail.events({
 	'click .backButton':function(){
    SessionAmplify.set('aImages',null);
    SessionAmplify.set('answerDetail',null);
    SessionAmplify.set('aCameraImagesList',null);
 		window.history.back();
 	},
  'click .asBestAnswer':function(){
    var qId = SessionAmplify.get('answerDetail').q;
    var aId = SessionAmplify.get('answerDetail').aId;
    var url = "http://52.34.229.35:9000/questions/"+qId;
    var tUId = this.u;
    HTTP.put(url,{
      data:{
        answerId:aId
      }
    },
      function(error,response){
        if(error){
          console.log(error)
        } else {
          var url2 = "http://52.34.229.35:9000/users/" + tUId;
       	  HTTP.get(url2, function(error, response){
       	    if(error){
       	      console.log(error);
       	    } else {
       	      console.log(JSON.parse(response.content).uMId);
       	      Meteor.call("serverNotification", JSON.parse(response.content).uMId, "BESTANSWER");
       	    }
       	  });
       	}
    });
  },
 	'click .chatlink': function(){
 	  var url0 = "http://52.34.229.35:9000/chat";
 	  var tUId = this.u;
 	  HTTP.post(url0,
 	   {
          data: {aId: this.aId, fUId: SessionAmplify.get('loginUser').data.uId, tUId: tUId, uuid: SessionAmplify.get('uuid')}
       },
 	   function(error, response){
 	    if(error){
 	      console.log(error);
 	    } else {
 	  	  var url = "http://52.34.229.35:9000/users/" + tUId;
       	  HTTP.get(url, function(error, response){
       	    if(error){
       	      console.log(error);
       	    } else {
       	      console.log(JSON.parse(response.content).uMId);
       	      Meteor.call("serverNotification", JSON.parse(response.content).uMId, "CHATREQUEST");
       	      window.open("http://52.34.229.35:3000/chat/" + SessionAmplify.get('loginUser').data.uId + "/" + tUId + "/" + SessionAmplify.get("uuid"));
       	    }
       	  });
 	    }
 	  });
 	},

 	'click .videolink': function(){
 		console.log("videolink clicked");
 		var url = "http://52.34.229.35:9000/videocall";
 		var tUId = this.u;
 		console.log("aId: " + this.aId + " tUId: " + tUId + " roomId: " + SessionAmplify.get("videoRoomId"));
 		HTTP.post(url, {
 				data: {aId: this.aId, tUId: tUId, roomId: SessionAmplify.get("videoRoomId")}
 			},
 			function(error, response){
 				if(error){
 					console.log("Failed to post new video request: " + error);
 				} else {
 					var url1 = "http://52.34.229.35:9000/users/" + tUId;
             		HTTP.get(url1, function(error, response){
             			if(error){
             				console.log("Failed to get uMId: " + error);
             			} else {
             				console.log(JSON.parse(response.content).uMId);
                            Meteor.call("serverNotification", JSON.parse(response.content).uMId, "VIDEOREQUEST");
                            window.open("http://52.34.229.35:3000/room/" + SessionAmplify.get("videoRoomId"), "_self");
             			}
             		});
 				}
 		});
 	}
 });

 Template.answerDetail.onCreated(function () {
 	var url = "http://52.34.229.35:9000/videoroomid";
 	HTTP.get(url, function(error, response){
 		if(error){
 			console.log(error);
 		} else {
 			SessionAmplify.set("videoRoomId", JSON.parse(response.content).videoRoomId);
 			console.log("Get videoRoomId: " + JSON.parse(response.content).videoRoomId);
 		}
 	});


 });