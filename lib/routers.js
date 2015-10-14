Router.configure({

	layoutTemplate:"layout",
});

Router.route('/',{
	name:'landing',
	template:'userlogin'
})

Router.route('/login',{name:'userlogin',
    onBeforeAction: function () {
      var loginUser = SessionAmplify.get('loginUser');
      if(loginUser!=null)
      { console.log(loginUser);
      	this.redirect('main');
      }
      else{
      	this.next();
      }
     
    }  
});

Router.route('/main',{name:'main'})
Router.route('/signup',{name:'usersignup'});