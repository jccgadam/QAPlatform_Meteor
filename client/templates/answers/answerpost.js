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

	Template.answerpost.onRendered(function(){
    var answerContent = SessionAmplify.get('answerContent');
    var auuid = SessionAmplify.get('auuid');
     if(answerContent.auuid === auuid)
      {
        $('.answerContent').val(SessionAmplify.get('answerContent').content); 
      }
	}) 
	//template helper
	Template.answerpost.helpers({
     questionTitle:function(){
       return SessionAmplify.get('questionDetail').title
     },
     questionContent:function(){
       return SessionAmplify.get('questionDetail').content;
     },
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
    'blur .answerContent':function(e,t){
    	  Session.set('validateAnswerContent',null);
        var content = e.target.value;
        var auuid = SessionAmplify.get('auuid');
        SessionAmplify.set('answerContent',{auuid:auuid,content:content})
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
        var aUUID = SessionAmplify.get('auuid');
        var content = t.$('.answerContent').val();
        var uId = loginUser.uId;
        var qId =  SessionAmplify.get('questionDetail').qId;
        var data = SessionAmplify.get('aCameraImages');
        if(!validateAnswerContent(content))
        {     console.log('content false')
              return false;
        }
     	HTTP.post("http://52.34.229.35:9000/answers",
          {
            data: {uId: uId,qId: qId,content: content,aUUID:aUUID}
          },
          //server response callback
          function (error, response) {
            if (error) {
              // console.log(error)
              Session.set('message','post fails')
                        }
            else{
                Meteor.call('addImage',aUUID,data, function(){});
                SessionAmplify.set('content',null);
                SessionAmplify.set('auuid',null);
                SessionAmplify.set('aImages',null);
                SessionAmplify.set('aCameraImages',null);
                SessionAmplify.set('aCameraImagesList',null);
                Router.go('main');
            }
          })

     },
     'click .backButton':function(e,t){
          e.preventDefault();
          SessionAmplify.set('content',null);
          SessionAmplify.set('auuid',null);
          SessionAmplify.set('aImages',null);
          SessionAmplify.set('aCameraImages',null);
          SessionAmplify.set('aCameraImagesList',null);
          Router.go('main')
     }
 })

