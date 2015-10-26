  Template.questionDetail.helpers({
  data:function(){
  	return this;
  }
  })

  Template.questionDetail.events({
   'click .backButton':function(e,t){
    e.preventDefault();
    window.history.back();
    }
  })