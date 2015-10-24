  function validateQuestionTitle(title){
    if(title=='')
    {
      Session.set('validateQuestionTitle','Please fill Question Title');
      return false;
    }
    else{
      SessionAmplify.set('title',title);
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
      SessionAmplify.set('content',content);
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
       $('body').css('height','1000px');
       $('form').css('height','1000px');
       $('.questionTitle').val(SessionAmplify.get('title')); 
       $('.questionContent').val(SessionAmplify.get('content'));
       $('.bootstrap-tagsinput').css("width",'100%')  
       document.getElementById("creditSet").innerHTML = document.getElementById("creditAmountBar").value;
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
     },
     maxCredit: function(){
        return JSON.parse(SessionAmplify.get('loginUser').content).credit;
      },
     message:function(){
      return Session.get('message');

     },
     uuid:function(){
        return SessionAmplify.get('uuid');
     },
     images:function(){
      var uuid = SessionAmplify.get('uuid');
      Meteor.call('Images',uuid,function(err,res){
        SessionAmplify.set('images',res)
      })
      return SessionAmplify.get('images');
// >>>>>>> update questionDetail
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

    'change .creditAmountBar': function(e){
        document.getElementById("creditSet").innerHTML = document.getElementById("creditAmountBar").value;
    },

    'click .btn': function(e){
        if(e.target.id == "cancleButton"){
            Router.go('main');
        }
    },
  'submit form':function(e,t){
      e.preventDefault();
      var title = t.$('.questionTitle').val();
      var content = t.$('.questionContent').val();
// >>>>>>> update questionDetail
        var finalTags= [];
        if(AllTags.find({'checked':'1'}).count()!=0)
         {
            AllTags.find({'checked':'1'}).fetch().forEach(function(k,v){
            finalTags.push(k.cId);
          })
         }

        var credit = Number(document.getElementById("creditSet").innerHTML);
        var loginUser = JSON.parse(SessionAmplify.get('loginUser').content);
        var uId = loginUser.uId;
        var uuid = SessionAmplify.get('uuid');
        var imageUrls = [];
        var images = SessionAmplify.get('images');
        
        _.each(images,function(k,v){
          imageUrls.push(k.url);
          console.log(k)
        })

        if(!(validateQuestionTitle(title)&&validateQuestionContent(content)&&validateTags(finalTags)))
        {
              return false;
        }

        HTTP.post("http://54.191.134.26:9000/questions",
          {
            data: {uId: uId, title: title, content: content, credit: credit, cIds: finalTags,UUID:uuid,imageUrls:imageUrls}
          },
          //server response callback
          function (error, response) {
            if (error) {
              console.log(error)
              Session.set('message','post fails')
                        }
            else{
// <<<<<<< HEAD
//               Session.set('title',null);
//               Session.set('content',null);
// <<<<<<< HEAD
// =======
// =======
              SessionAmplify.set('title',null);
              SessionAmplify.set('content',null);
              SessionAmplify.set('uuid',null);
// >>>>>>> update questionDetail
              AllTags.clear();
// >>>>>>> update
              Router.go('questions');
            }
          })

     },

  'click .questionCancelBtn':function(e,t){
     var uuid = SessionAmplify.get('uuid')
     Meteor.call('removeImage',uuid,function(err,res){
       if(res)
         {
          SessionAmplify.set('title',null);
          SessionAmplify.set('content',null);
          SessionAmplify.set('uuid',null);
          SessionAmplify.set('pics',null);
          AllTags.clear();
          Router.go('main')
         }
     })
     

  }
 })