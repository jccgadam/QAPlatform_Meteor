Template.userProfile.helpers({
	data:function(){
		return this;
	},
	categories:function(){
    var url2 = "http://52.34.229.35:9000/categories";
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
 	   var url = "http://52.34.229.35:9000/users/"+uId;
     var firstName = t.$('.firstName')[0].innerHTML;
     var lastName  = t.$('.lastName')[0].innerHTML
     var email = t.$('.email')[0].innerHTML
     var cIds = t.data.expertises;

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
  },
  'keyup .searchTagsField' : function(event,template){
  		//console.log(Session.get('questionTags'));
          if(event.target.id == "searchTagsField"){
              if(document.getElementById("searchTagsField").value == ""){
                  Session.set("searchTagsField",null);
              } else {
                  var input = document.getElementById("searchTagsField").value;
                  Session.set("searchTagsField", input);
              }
          }
      },
  	'change .tagCheck':function(e,t){
          e.preventDefault();
          Session.set('tagsError',null);
          var checkedTag = parseInt(e.target.value);
          var checked = UserTags.findOne({'cId':checkedTag}).checked;
          if(checked =='0')
          {
          	UserTags.update({'cId':checkedTag},{$set:{'checked':'1'}});
          }
          else if(checked=='1')
          {
          	UserTags.update({'cId':checkedTag},{$set:{'checked':'0'}});
          }
      },
})