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
             Session.set('emailError','Please enter email');
             
             return;
          }
          //check if password is empty
          else if(password=='')
          { 
            Session.set('passwordError','Please enter passord');
            return;
          }
          else{

            HTTP.post("http://54.191.134.26:9000/signin",
          {
            data: {email:email, password:password}
          },
          //server response callback
          function (error, response) {
            if (error) {
              console.log(error);
              Session.set('message','Email not exist or wrong password')
                        }
            else{
                 Session.set('emailError',null);
                 Session.set('passwordError',null);
                 Session.set('message',null);
                 SessionAmplify.set('loginUser',response);
                 Router.go('main')
            }

	          })
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