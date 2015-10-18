 AllTags = new DumbCollection('AllTags');
 TmpTags = new DumbCollection('TmpTags');
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
      { 
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
Router.route('/addTags',{name:'addTags',
  onBeforeAction:function(){
    TmpTags.clear();
    this.next();
  }
})
Router.route('/editAddTags',{name:'editAddTags'});
Router.route('/main', function () {
  this.render('main');
});
