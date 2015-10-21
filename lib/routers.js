 AllTags = new DumbCollection('AllTags');
 TmpTags = new DumbCollection('TmpTags');
 Items = new Mongo.Collection('items');
 Uploads = new Mongo.Collection('uploads');
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

<<<<<<< HEAD
Router.route('/notifications', function () {
  this.render('notifications');
});

=======
>>>>>>> update
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
Router.route('/home',{name:'home',

    waitOn: function() {
      return [
        Meteor.subscribe('items'),
        Meteor.subscribe('uploads')
      ];
    },
    data: function() {
      return {
        item: Items.findOne(),
        uploads: Uploads.find()
      }
    }
  });
Router.route('/editAddTags',{name:'editAddTags'});
Router.route('/main', function () {
  this.render('main');
});
var requireLogin = function() {
  if (SessionAmplify.get('loginUser')==null) {
     
       Router.redirect('/login')
  }
   else 
  {
  this.next();
  }
  };
//

// Router.onBeforeAction(requireLogin);