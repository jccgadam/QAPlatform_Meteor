 Template.answerDetail.helpers({
  data:function(){
  	console.log(this);
  	return this;
  },
  uuid:function(){
  	return SessionAmplify.get('uuid');
  },
  fId:function(){
  	return SessionAmplify.get('loginUser').data.uId;
  },
  tId:function(){
  	console.log(this);
  	return this.u;
  },
  videoRoomId: function(){
  	return SessionAmplify.get("videoRoomId");
  }
  });

 Template.answerDetail.events({
 	'click .backButton':function(){
 		console.log('back');
 		window.history.back();
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