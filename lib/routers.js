 AllTags = new DumbCollection('AllTags');
 function monthNumberToString(createMonth){
    switch(Number(createMonth)) {
        case 1:
            return "Jan";
            break;
        case 2:
            return "Feb";
            break;
        case 3:
            return "Mar";
            break;
        case 4:
            return "Apr";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "Jun";
            break;
        case 7:
            return "Jul";
            break;
        case 8:
            return "Aug";
            break;
        case 9:
            return "Sep";
            break;
        case 10:
            return "Oct";
            break;
        case 11:
            return "Nov";
            break;
        case 12:
            return "Dec";
            break;
        default:
            return "Jan";
    }
}

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
  waitOn:function(){
    SessionAmplify.set('obj',null);
    var id = this.params.id; 
    var url = "http://54.191.134.26:9000/questions/" + id;
    HTTP.get(url, function (error, response) {
        if (error) {
            SessionAmplify.set("obj", null);
        }
        else{
          console.log(response);
            var obj = JSON.parse(response.content);
            var createMonth = monthNumberToString(obj.createDate.split("/")[1]);
            
            obj.createMonth = createMonth;
            obj.createDay = obj.createDate.split("/")[2];
            obj.displayTitle = obj.title;
            if(obj.title.length > 16){
                    obj.displayTitle = obj.title.substring(0, 17) + "..";
                }
                obj.displayContent = obj.content;
                if(obj.content.length > 28){
                    obj.displayContent = obj.content.substring(0, 29) + "..";
                }
             SessionAmplify.set('obj',obj);       
        }
    });
 },
 data:function(){
  return SessionAmplify.get('obj');
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
   },

   
  })

Router.route('/addTags',{name:'addTags',
  waitOn:function(){
    
        HTTP.get("http://54.191.134.26:9000/categories", function (error, response) {
        if (error) {
           console.log(error);
        }
        else{
          if(AllTags.find().fetch().length==0)
            {
              var obj = JSON.parse(response.content).results;
            _.each(obj,function(k,v){
              AllTags.insert({'cName':k.cName,'cId':k.cId,'checked':'0'})
            })
            }
           
        }
      }) 
   },
   data:function(){
       return AllTags.find();
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