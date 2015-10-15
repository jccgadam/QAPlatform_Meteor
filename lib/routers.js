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

Router.route('/signup',{name:'usersignup'});

Router.route('/questions', function () {
  this.render('questions');
});
Router.route('/questionsPost',{name:'questionsPost'})
Router.route('/questionDetail', function () {
  this.render('questionDetail');
});

Router.route('/main', function () {
  this.render('main');
});
