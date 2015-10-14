
Template.userlogin.events({
    
    'submit .userlogin':function(e,t){
          e.preventDefault();
          var email = t.$('.email').val();
          var password =t.$('.password').val(); 
          //check if email is empty
          if(email=='')
          {  
             Session.set('emailError','Please enter email');
             // console.log(Session.get('emailError'));
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