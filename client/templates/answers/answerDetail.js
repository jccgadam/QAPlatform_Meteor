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
  }
  })

 Template.answerDetail.events({
 	'click .backButton':function(){
 		console.log('back');
 		window.history.back();
 	},

 	'click .chatlink': function(){
 	  var url0 = "http://54.191.134.26:9000/chat";
 	  HTTP.post(url0,
 	   {
          data: {aId: this.aId, fUId: SessionAmplify.get('loginUser').data.uId, tUId: this.u, uuid: SessionAmplify.get('uuid')}
       },
 	   function(error, response){
 	    if(error){
 	      console.log(error);
 	    } else {
 	    }
 	  });

  	  var url = "http://54.191.134.26:9000/users/" + this.u;
   	  HTTP.get(url, function(error, response){
   	    if(error){
   	      console.log(error);
   	    } else {
   	      console.log(JSON.parse(response.content).uMId);
   	      Meteor.call("serverNotification", JSON.parse(response.content).uMId, "CHATREQUEST");
   	    }
   	  });

//   	  Router.go("http://54.191.134.26:3000/chat/" + SessionAmplify.get('loginUser').data.uId + "/" + this.u + "/" + SessionAmplify.get('uuid'));
 	}
 })