 Template.answerDetail.helpers({
  data:function(){
  	console.log(this);
  	return this;
  }
  })

 Template.answerDetail.events({
 	'click .backButton':function(){
 		window.history.back();
 	}
 })