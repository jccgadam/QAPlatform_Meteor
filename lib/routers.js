 AllTags = new DumbCollection('AllTags');
 UserTags =new DumbCollection('UserTags');
// chatCollection = new Meteor.Collection('chatCollection');

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

Router.route('/test',{name:'test'});

Router.route('/',{
	name:'landing',
	template:'userlogin',
    onBeforeAction:function(){
   if(typeof SessionAmplify.get("loginUser") == 'undefined' || SessionAmplify.get("loginUser") == null)
   {
      Router.go("/login");;
   }
    else{
      Router.go('/main');
    }
  },
  onStop:function(){
    console.log('leave page');
  }
})

Router.route('/img/:id',{name:'viewImg',
  waitOn:function(){
        Meteor.call('singleCameraImg',this.params.id,function(err,res){
          if(res)
          {
             SessionAmplify.set('singleCameraImg',res)
          }
         
        })
        
       },
  data:function(){
    return SessionAmplify.get('singleCameraImg');
  }  

})

Router.route('/login',{name:'userlogin',
    onBeforeAction: function () {
      if(typeof SessionAmplify.get("loginUser") == 'undefined' || SessionAmplify.get("loginUser") == null)
      {
        this.render("userlogin");
      } else {
        Router.go('/main');
      }
    }  
});

Router.route('/signup',{name:'usersignup'});

Router.route('/userProfile/',{name:'userProfile',
  onBeforeAction:function(){
   if(typeof SessionAmplify.get("loginUser") == 'undefined' || SessionAmplify.get("loginUser") == null)
   {
      Router.go("/login");;
   }
    else{
      this.next();
    }
  },
  waitOn:function(){
    var uId = SessionAmplify.get('loginUser').data.uId
    var url = "http://52.34.229.35:9000/users/" + uId;
    HTTP.get(url, function (error, response) {
        if (error) {

           SessionAmplify.set('userProfile',null);

        }
        else{
           SessionAmplify.set('userProfile',response.data) 
        }
    });
  }, 
 data:function(){
     return SessionAmplify.get('userProfile');
 }
})

Router.route('/questions', function () {
  this.render('questions');
});

Router.route('/question/:id',{name:'questionDetail',
  waitOn:function(){
    var id = this.params.id; 
    var url = "http://52.34.229.35:9000/questions/" + id;
    HTTP.get(url, function (error, response) {
        if (error) {
           SessionAmplify.set('questionDetail',null);
        }
        else{
          
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

                url2 = "http://52.34.229.35:9000/users/" + obj.uId;
                HTTP.get(url2, function(err, res){
                    if(err){
                        console.log(err);
                    } else {
                        var user = JSON.parse(res.content);
                        console.log(user.email);
                        obj.questioner = user.email;
                    }
                    SessionAmplify.set('questionDetail',obj);
                });
        }
    });
 },
 data:function(){
  return SessionAmplify.get('questionDetail');
 }

})
Router.route('/answerpost',{
   name:'answerpost',
   onBeforeAction:function(){
    var auuid = SessionAmplify.get('auuid');
    if(typeof auuid==='undefined'||auuid===null)
    {
      SessionAmplify.set('auuid',Meteor.uuid());
    }
      this.next();
   }
})
Router.route('/answer/:id',{name:'answerDetail',
  waitOn:function(){
    var id = this.params.id; 
    var url = "http://52.34.229.35:9000/answers/" + id;
    HTTP.get(url, function (error, response) {
        if (error) {
           SessionAmplify.set('answerDetail',null);
        }
        else{
           var obj = response.data;
         	var url2 = "http://52.34.229.35:9000/isonline/" + obj.u;
         	HTTP.get(url2, function(error, response){
                if(error){
                    console.log("error");
                } else{
                    var isOnLine = JSON.parse(response.content).isOnLine;
                    console.log("Answerer is Online " + isOnLine);
                    SessionAmplify.set("answererIsOnLine", isOnLine);
                }
         	});
           SessionAmplify.set('answerDetail',null);
           SessionAmplify.set('answerDetail',obj);       
        }
    });
 },
 data:function(){
  return SessionAmplify.get('answerDetail');
 }

})



Router.route('/notifications', function () {
  this.render('notifications');
});

Router.route('/questionsPost',{name:'questionsPost',
   onBeforeAction:function(){
    Session.set('validateTags',null);
    var uuid = SessionAmplify.get('uuid');
    console.log(uuid);
    if(uuid==='undefined'||uuid==null)
    {
      SessionAmplify.set('uuid',Meteor.uuid());
    }
      this.next();
   },

   
  })

Router.route('/addTags',{name:'addTags',
  waitOn:function(){
        HTTP.get("http://52.34.229.35:9000/categories", function (error, response) {
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

Router.route('/editUserTags/:id',{name:'editUserTags',
  onBeforeAction:function(){
   if(typeof SessionAmplify.get("loginUser") == 'undefined' || SessionAmplify.get("loginUser") == null)
   {
      Router.go("/login");
   }
    else{
      this.next();
    }
  },
  waitOn:function(){
    var cId = SessionAmplify.get('userProfile').expertises;
    HTTP.get("http://52.34.229.35:9000/categories", function (error, response) {
        if (error) {
           console.log(error);
        }
        else{
          if(UserTags.find().fetch().length==0)
            {
              var obj = JSON.parse(response.content).results;
            _.each(obj,function(k,v){
              if(cId.indexOf(k.cId)>-1)
              {
               UserTags.insert({'cName':k.cName,'cId':k.cId,'checked':'1'})
              }
              else{
                UserTags.insert({'cName':k.cName,'cId':k.cId,'checked':'0'})
              } 

            })
            }
           
        }
      }) 
    
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

// Router.route('/chat/:fid/:tid/:uuid',{name:'chat',
//  waitOn:function(){
//   var fid = this.params.fid;
//   var tid = this.params.tid;
//   var uuid = this.params.uuid;
//   Session.set('chatDetail',{fid:fid,tid:tid,uuid:uuid});
// }
// })

Router.route('/editAddTags',{name:'editAddTags'});
Router.route('/main', function () {
    if(SessionAmplify == null){
        Router.go("/login");
    } else {
        this.render('main');
    }
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