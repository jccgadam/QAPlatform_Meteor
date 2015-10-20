	function validateQuestionTitle(title){
		if(title=='')
		{
			Session.set('validateQuestionTitle','Please fill Question Title');
			return false;
		}
		else{
      Session.set('title',title);
			return true;
		}
	}

	function validateQuestionContent(content){
		if(content=='')
		{
			Session.set('validateQuestionContent','Please fill Question Content');
			return false;
		}
		else{
      Session.set('content',content);
			return true;
		}
	}

	function validateTags(tags){
    console.log(tags);
	    if(tags.length==0)
	    {
	    	Session.set('validateTags','Please add Question Tags');
	    	return false;
	    }
	    else{
	    	return true;
	    }
	}

	Template.questionsPost.onRendered(function(){
	     
       $('.questionTitle').val(Session.get('title')); 
       $('.questionContent').val(Session.get('content'));
       $('.bootstrap-tagsinput').css("width",'100%')  

	})
	//template helper
	Template.questionsPost.helpers({
     validateQuestionTitle:function(){
      // console.log(Session.get('validateQuestionTitle'))
     	return Session.get('validateQuestionTitle');
     },
     validateQuestionContent:function(){
      // console.log(Session.get('validateQuestionContent'))
     	return Session.get('validateQuestionContent');
     },
     validateTags:function(){
     	return Session.get('validateTags');
     },
     tags:function(){

     return AllTags.find({'checked':'1'}).fetch();
     }
	})

    //template events helper
	Template.questionsPost.events({
    'blur .questionTitle':function(e,t){

      Session.set('validateQuestionTitle',null);
    	var title = e.target.value;
    	return validateQuestionTitle(title);
    },
    'blur .questionContent':function(e,t){

    	  Session.set('validateQuestionContent',null);
        var content = e.target.value;
        return validateQuestionContent(content);
    },
	  'submit form':function(e,t){
     	e.preventDefault();
     	var title = t.$('.questionTitle').val();
     	var content    = t.$('.questionContent').val();
      var tags= [];
        if(AllTags.find({'checked':'1'}).count()!=0)
         {
            AllTags.find({'checked':'1'}).fetch().forEach(function(k,v){
            tags.push(k.cId);
          })
         }
         
        // console.log(SessionAmplify.get('pics'));
        var credit = t.$('.creditSelect').val();
        var loginUser =  SessionAmplify.get('loginUser');
        var uId = loginUser.uId;
        // console.log(SessionAmplify.get('pics'));
        // console.log(tags);
        if(!(validateQuestionTitle(title)&&validateQuestionContent(content)&&validateTags(tags)))     	
           {          
                       	 
              return false;
           }
           
     	HTTP.post("http://52.89.233.213:9000/questions",
          {
            data: {
            	   
            	   uId:1,title:title,content:content

                  }

          },
          //server response callback
          function (error, response) {
            if (error) {
              // console.log(error)
              Session.set('message','post fails')
                        }
            else{
              Session.set('title',null);
              Session.set('content',null);
              // console.log(response);
              Router.go('questions');
              
            }
          })
  	 
     }
 })