Template.userlogin.onCreated(function(){
    SessionAmplify = _.extend({}, Session, {
      keys: _.object(_.map(amplify.store(), function(value, key) {
          value = null;
          return [key, null];
      })),
      set: function (key, value) {
          Session.set.apply(this, arguments);
          amplify.store(key, value);
      },
    });
  //clear all session var
  Session.set('emailError',null);
  Session.set('passwordError',null);
  Session.set('message',null);
})
Template.userlogin.events({   
    'blur .email':function(e,t){
          Session.set('emailError',null);
          var email = t.$('.email').val();
           if(email=='')
          {  console.log(Session.get('emailError'));
             Session.set('emailError','Please enter email');
             
             return;
          }

    },
    'blur .password':function(e,t){
          Session.set('passwordError',null);
          var password =t.$('.password').val(); 
          if(password=='')
          { 
            Session.set('passwordError','Please enter passord');
            return;
          }
    },
    'submit .userlogin':function(e,t){
          console.log("Login button tapped");
          e.preventDefault();
          //clear all session var
          Session.set('emailError',null);
          Session.set('passwordError',null);
          Session.set('message',null);
          var email = t.$('.email').val();
          var password =t.$('.password').val(); 
          //check if email is empty
          if(email=='')
          {
             console.log("Email empty");
             Session.set('emailError','Please enter email');
             return;
          }
          //check if password is empty
          else if(password=='')
          {
            console.log("Password empty");
            Session.set('passwordError','Please enter passord');
            return;
          }
          else{
            Meteor.loginWithPassword(email, password, function(err){
                if(err){
                   console.log(err);
                   Session.set('message','Email not exist or wrong password')
                } else {
                   console.log("Login to Meteor");
                   var url = "http://52.34.229.35:9000/usersbyumid/" + Meteor.userId();
                   HTTP.get( url, function (error, response) {
                    if (error) {
                        console.log(error);
                        Session.set('message','Network is down')
                    } else {
                        console.log("Login to Play");
                        Session.set('emailError',null);
                        Session.set('passwordError',null);
                        Session.set('message',null);
                        SessionAmplify.set('loginUser',response);
                        Router.go('main')
                    }
                   });
                }
            });
          }
    }
})

Template.userlogin.helpers({
	message:function(){
	   return Session.get('message')
	},
  emailError:function(){
    return Session.get('emailError')
  },
  passwordError:function(){
    return Session.get('passwordError')
  }
})