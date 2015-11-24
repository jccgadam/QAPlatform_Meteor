Template.userProfile.helpers({
	data:function(){
		return this;
	},
	categories:function(){
    var url2 = "http://54.191.134.26:9000/categories";
    HTTP.get(url2, function (error, response) {
        if(error){
            SessionAmplify.set("categories", null);
        } else{
            var cats = JSON.parse(response.content).results;
            SessionAmplify.set("categories", cats);
        }
    });
		var cats = SessionAmplify.get('categories');
        var res = [];
        var cId = this.expertises;
        _.each(cats,function(k,v){
          if(cId.indexOf(k.cId)>-1)
          { 
          	res.push(k.cName)
          }
		})
		return res;
	}
})

Template.userProfile.events({
 'click .backButton, click .cancelButton':function(e,t){
   e.preventDefault();
   Router.go("/main");
 },
 'click .saveChanges':function(e,t){
 	e.preventDefault();
     var uId = SessionAmplify.get('loginUser').data.uId
 	   var url = "http://54.191.134.26:9000/users/"+uId;
     var firstName = t.$('.firstName')[0].innerHTML;
     var lastName  = t.$('.lastName')[0].innerHTML
     var email = t.$('.email')[0].innerHTML
     var cIds = t.data.expertises;
     console.log(cIds);
     console.log(firstName);
     console.log(lastName);
     console.log(email);
     HTTP.put(url, 
    	{
    	data:{
         firstName:firstName,lastName:lastName,email:email
    	}
        },
    	function (error, response) {
        if (error) {
           console.log(error)
        }
        else{
        	Router.go('/main')
        }

    })
  }
})