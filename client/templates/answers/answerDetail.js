 Template.answerDetail.helpers({
  data:function(){
  	console.log(this);
  	return this;
  },
  uuid:function(){
  	return SessionAmplify.get('uuid')
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
 	}
 })