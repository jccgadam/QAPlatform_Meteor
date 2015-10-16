	function validateQuestionTitle(title){
		if(title=='')
		{
			Session.set('validateQuestionTitle','Please fill Question Title');
			return false;
		}
		else{
			return true;
		}
	}

	function validateQuestionContent(title){
		if(title=='')
		{
			Session.set('validateQuestionContent','Please fill Question Content');
			return false;
		}
		else{
			return true;
		}
	}

	function validateTags(tags){
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
	// Create the bootstrap tag input UI
	  // $('input[data-role="tagsinput"]').css("width",10000);
      // $('input[data-role="tagsinput"]').tagsinput('item');
      
      // $('input[data-role="tagsinput"]').tagsinput({
      
      // onTagExists: function(item, $tag) {
	    
	     //  $tag.hide.fadeIn();
      //   }

      // });

       $('.bootstrap-tagsinput').css("width",'100%')  

	})
	//template helper
	Template.questionsPost.helpers({
     validateQuestionTitle:function(){
     	return Session.get('validateQuestionTitle');
     },
     validateQuestionContent:function(){
     	return Session.get('validateQuestionContent');
     },
     // validateTags:function(){
     // 	return Session.get('validateTags');
     // },
     tags:function(){
      return Session.get('questionTags');
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
    'blur .validateTags':function(e,t){

    	Session.set('validateTags',null);
        var tags = e.target.value;

        return validateTags(tags);
    },		
	'submit form':function(e,t){
     	e.preventDefault();
     	var title = t.$('.questionTitle').val();
     	var content    = t.$('.questionContent').val();
        var tags  = t.$('input[data-role="tagsinput"]').val();
        var credit = t.$('.creditSelect').val();
        var loginUser =  SessionAmplify.get('loginUser');
        var uId = loginUser.uId;
        var createdAt = new Date();
        var createdTime =  createdAt.toLocaleTimeString();
        var createdDate = createdAt.toLocaleDateString();
        //var cId = [1]
        //var data = JSON.stringify(cId);
        //console.log(data);
        
        if(!(validateTags(title)&&validateQuestionTitle(title)&&validateQuestionContent(content)))     	
           {          
                       	 
              return false;
           }
           
     	HTTP.post("http://52.89.233.213:9000/questions",
          {
            data: {
            	   
            	   uId:1,title:title,content:content,cId:[1]

                  }

          },
          //server response callback
          function (error, response) {
            if (error) {
              Session.set('message','post fails')
                        }
            else{
              
              console.log(response);
              Router.go('questions');
              
            }
          })
  	 
     }
 })