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
        if(!SessionAmplify.get("userCredit")){
           SessionAmplify.set("userCredit", JSON.parse(SessionAmplify.get('loginUser').content).credit);
        }
       $('.questionTitle').val(SessionAmplify.get('title')); 
       $('.questionContent').val(SessionAmplify.get('content'));
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
      if(AllTags.find({'checked':'1'}).count()==0)
        {
         return SessionAmplify.get('tags');
        }
     return AllTags.find({'checked':'1'}).fetch();
     },
     maxCredit: function(){
        if(SessionAmplify.get("userCredit")){
            return SessionAmplify.get("userCredit");
        }
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
      if(uuid){
          Meteor.call('Images',uuid,function(err,res){
            // console.log(res);
            SessionAmplify.set('images',res)
          });
      }
      return SessionAmplify.get('images');
     },
     cameraImages:function(){
      // var uuid = SessionAmplify.get('cameraImages');
      return SessionAmplify.get('cameraImages');

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

    'change .creditAmountBar': function(e,t){
        document.getElementById("creditSet").innerHTML = document.getElementById("creditAmountBar").value;
    },
    // 'click .addPictures':function(e,t){
    //    var tmp = AllTags.find({'checked':'1'}).fetch();
    //    SessionAmplify.set('tags',tmp);
    // },
    'click .takePictures':function(e,t){
        // var cameraOptions = {
        //     width: 400,
        //     height: 300
        // };
        if(SessionAmplify.get('cameraImages') == null||(SessionAmplify.get('cameraImages') == 'undefined'))
          {
            SessionAmplify.set('cameraImages',[]);
          }
        MeteorCamera.getPicture(function(err,res){
         if(res)
          {  
            var imgs=[];
            imgs = SessionAmplify.get('cameraImages')
            imgs.push(res);
            SessionAmplify.set('cameraImages',imgs);
          }
        })
    },
    'submit form':function(e,t){
      e.preventDefault();
      var title = t.$('.questionTitle').val();
      var content = t.$('.questionContent').val();
        var finalTags= [];
        if(AllTags.find({'checked':'1'}).count()!=0)
         {
            AllTags.find({'checked':'1'}).fetch().forEach(function(k,v){
            finalTags.push(k.cId);
          })
         }
         else{
         var array =  SessionAmplify.get('tags');
          _.each(array,function(k,v){
            finalTags.push(k.cId);
          })
         }

        var credit = Number(document.getElementById("creditSet").innerHTML);
        var loginUser = JSON.parse(SessionAmplify.get('loginUser').content);
        var uId = loginUser.uId;
        var uuid = SessionAmplify.get('uuid');
        var imageUrls = [];
        var images = SessionAmplify.get('images');
        var data = SessionAmplify.get('cameraImages');
        _.each(images,function(k,v){
          imageUrls.push(k.url);
        })

        if(!(validateQuestionTitle(title)&&validateQuestionContent(content)&&validateTags(finalTags)))
        {
            console.log('error');
            return false;
        }

        HTTP.post("http://52.34.229.35:9000/questions",
          {
            data: {uId: uId, title: title, content: content, credit: credit, cIds: finalTags,UUID:uuid,imageUrls:imageUrls}
          },
          //server response callback
          function (error, response) {
            if (error) {
              console.log(error);
              Session.set('message',error);
            } else {
                SessionAmplify.set("userCredit", SessionAmplify.get("userCredit") - credit);
                SessionAmplify.set('title',null);
                SessionAmplify.set('content',null);
                SessionAmplify.set('uuid',null);
                SessionAmplify.set('title',null);
                SessionAmplify.set('tags',null);
                SessionAmplify.set('images',null);
                SessionAmplify.set('cameraImages',null);
                SessionAmplify.set('cameraImagesList',null);
                SessionAmplify.set('uuid', null);
                AllTags.clear();
                Meteor.call('addImage',uuid,data, function(){});
              var targets = JSON.parse(response.content).results;
              for(var i = 0; i < targets.length; i ++){
                Meteor.call("serverNotification", targets[i].uMId, "NEWQUESTION");
              }
              Router.go('main');
            }
          });
     },
  'click .questionCancelBtn':function(e,t){
          SessionAmplify.set('title',null);
          SessionAmplify.set('content',null);
          SessionAmplify.set('uuid',null);
          SessionAmplify.set('images',null);
          SessionAmplify.set('tags',null);
          SessionAmplify.set('cameraImages',null);
          SessionAmplify.set('cameraImagesList',null);
          AllTags.clear();
          Router.go('main');
  },
  'click .backButton':function(e,t){
    e.preventDefault();
    Router.go('main');
  }

 })