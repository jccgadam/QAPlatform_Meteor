
Template.userlogin.events({
    'blur input':function(e,t){
          Session.set('message',null);
    },
	'click button':function(e,t){
          e.preventDefault();
          var email = t.$('.email').val();
          var password =t.$('.password').val(); 
          // if(email==null)
          // {  
          //    Session.set('message','email is empty');
          // }
          HTTP.post("http://52.89.233.213:9000/signin",
          {
           data: {email:email, password:password}
          },
          //server response
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
})

Template.userlogin.helpers({
	message:function(){
	   return Session.get('message')
	}
})