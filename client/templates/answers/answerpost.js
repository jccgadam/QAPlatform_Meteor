	// function validateQuestionTitle(title){
	// 	if(title=='')
	// 	{
	// 		Session.set('validateQuestionTitle','Please fill Question Title');
	// 		return false;
	// 	}
	// 	else{
 //      Session.set('title',title);
	// 		return true;
	// 	}
	// }

	function validateAnswerContent(content){
		if(content=='')
		{
			Session.set('validateAnswerContent','Please fill Answer Content');
			return false;
		}
		else{
      Session.set('aContent',content);
			return true;
		}
	}

	// function validateTags(tags){
	//     if(tags.length==0)
	//     {
	//     	Session.set('validateTags','Please add Question Tags');
	//     	return false;
	//     }
	//     else{
	//     	return true;
	//     }
	// }

	// Template.answerpost.onRendered(function(){
	     
 //       $('.questionTitle').val(Session.get('title')); 
 //       $('.questionContent').val(Session.get('content'));
 //       $('.bootstrap-tagsinput').css("width",'100%')  
 //       document.getElementById("creditSet").innerHTML = document.getElementById("creditAmountBar").value;
	// })
	//template helper
	Template.answerpost.helpers({
     // validateQuestionTitle:function(){
     //  // console.log(Session.get('validateQuestionTitle'))
     // 	return Session.get('validateQuestionTitle');
     // },
     validateAnswerContent:function(){
     	return Session.get('validateAnswerContent');
     },
     auuid:function(){
     	return SessionAmplify.get('auuid');
     },
     images:function(){
      var auuid = SessionAmplify.get('auuid');
      if(auuid){
          Meteor.call('Images',auuid,function(err,res){
            SessionAmplify.set('aImages',res)
          });
      }
      return SessionAmplify.get('aImages');
      },
      cameraImages:function(){
      return SessionAmplify.get('aCameraImages');

     }



    
	})

    //template events helper
	Template.answerpost.events({
    'blur .questionContent':function(e,t){

    	  Session.set('validateAnswerContent',null);
        var content = e.target.value;
        return validateAnswerContent(content);
    },
    'change .creditAmountBar': function(e){
        document.getElementById("creditSet").innerHTML = document.getElementById("creditAmountBar").value;
    },
    'click .takePictures':function(e,t){        
        if(SessionAmplify.get('aCameraImages')==null||(typeof SessionAmplify.get('aCameraImages')=='undefined'))
          {
            SessionAmplify.set('aCameraImages',[]);
          }
        MeteorCamera.getPicture(function(err,res){
         if(res)
          {  console.log(res.length);
            var imgs=[];
            imgs = SessionAmplify.get('aCameraImages')
            imgs.push(res);
            SessionAmplify.set('aCameraImages',imgs);
          }
        })
    },

    'click .btn': function(e){
        if(e.target.id == "cancleButton"){
            Router.go('main');
        }
    },
     'click .answerCancelBtn':function(e,t){
          SessionAmplify.set('content',null);
          SessionAmplify.set('auuid',null);
          SessionAmplify.set('aImages',null);
          SessionAmplify.set('aCameraImages',null);
          SessionAmplify.set('aCameraImagesList',null);
          
          AllTags.clear();
          Router.go('main');
    },
	'submit form':function(e,t){
     	e.preventDefault();
        var loginUser = JSON.parse(SessionAmplify.get('loginUser').content);
        var content = t.$('.answerContent').val();
        var uId = loginUser.uId;
        var qId =  SessionAmplify.get('questionDetail').qId;

        if(validateAnswerContent(content))
        {
              return false;
        }

     	HTTP.post("http://52.34.229.35:9000/answers",
          {
            data: {u: uId,q: qId,content: content}
          },
          //server response callback
          function (error, response) {
            if (error) {
              // console.log(error)
              Session.set('message','post fails')
                        }
            else{
              Session.set('content',null);
              Router.go('questions');
            }
          })

     }
 })

