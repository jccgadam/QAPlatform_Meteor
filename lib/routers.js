 AllTags = new DumbCollection('AllTags');
 // TmpTags = new DumbCollection('TmpTags');

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

Router.route('/question/:id',{name:'questionDetail',
 data:function(){ 
   var id = this.params.id
  for(i = 0; i < SessionAmplify.get("tmpResult").length; i ++)
    {
      if(SessionAmplify.get("tmpResult")[i].qId.toString() === id)
      {
         return SessionAmplify.get("tmpResult")[i];
      }
  
    }
  }
})

Router.route('/notifications', function () {
  this.render('notifications');
});

Router.route('/questionsPost',{name:'questionsPost',
   onBeforeAction:function(){
    Session.set('validateTags',null);
    if(SessionAmplify.get('uuid')==null||(typeof SessionAmplify.get('uuid')=='undefined'))
      {
        SessionAmplify.set('uuid',Meteor.uuid());
      }
      this.next();
   }
   
  })

Router.route('/addTags',{name:'addTags',
  // onBeforeAction:function(){
  //   // AllTags.clear();
  //   this.next();
  // }
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