SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)]
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  },
});

Template.userlogin.onCreated(function(){
  //clear all session var
  Session.set('emailError',null);
  Session.set('passwordError',null);
  Session.set('message',null);
})
Template.userlogin.events({   
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

            HTTP.post("http://52.89.233.213:9000/signin",
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
    },
    'blur .email':function(e,t){
          Session.set('emailError',null);
    },
    'blur .password':function(e,t){
          Session.set('passwordError',null);
    },

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