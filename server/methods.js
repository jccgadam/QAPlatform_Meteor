Meteor.methods({
  'deleteFile': function(_id) {
    check(_id, String);

    var upload = Uploads.findOne(_id);
    if (upload == null) {
      throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
    }

    UploadServer.delete(upload.path);
    Uploads.remove(_id);
  },
  'Images':function(uuid){
  	var mysql = Meteor.npmRequire('mysql');
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });
       connection.connect();
        connection.query("select * from images where uuid='"+uuid+"';", function(err, rows, fields) {
            if (err)
            {
               myFuture.throw(err)
            }
            else {
               myFuture.return(rows);
            }
        });
         connection.end();
       return myFuture.wait();
  },
  'addImage':function(uuid,imgData){
  	var mysql = Meteor.npmRequire('mysql');

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });
       connection.connect();
       _.each(imgData,function(k,v)
       { 
         var imgData = k;
         console.log("insert into imgCamera (img64,uuid) values('"+imgData+"',"+"'"+uuid+"');");
        connection.query("insert into imgCamera (img64,uuid) values('"+imgData+"',"+"'"+uuid+"');", function(err, rows, fields) {
            if (err)
            {
                console.log(err);
            }
            else {
            }
        });
      })
         connection.end();
  },
  'cameraImages':function(uuid){
   
    var mysql = Meteor.npmRequire('mysql');
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });
       connection.connect();
       console.log("select * from imgCamera where uuid='"+uuid+"';");
        connection.query("select * from imgCamera where uuid='"+uuid+"';", function(err, rows, fields) {
            if (err)
            {
               console.log(err);
               myFuture.throw(err)
            }
            else {
               console.log(rows);
               myFuture.return(rows);
            }
        });
         connection.end();
       return myFuture.wait();  
  },
  'singleCameraImg':function(id){
     var mysql = Meteor.npmRequire('mysql');
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

        var connection = mysql.createConnection({
            host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
            user     : 'root',
            password : '12345678',
            database : 'images',
        });
       connection.connect();
        connection.query("select * from imgCamera where id='"+id+"';", function(err, rows, fields) {
            if (err)
            {  console.log(err);
               myFuture.throw(err)
            }
            else {
             
               myFuture.return(rows);
            }
        });
         connection.end();
       return myFuture.wait();
  },
  // 'getChatMessages':function(fid,tid,uuid){
    
  //    var mysql = Meteor.npmRequire('mysql');
  //   Future = Npm.require('fibers/future');
  //   var myFuture = new Future();

  //       var connection = mysql.createConnection({
  //           host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
  //           user     : 'root',
  //           password : '12345678',
  //           database : 'images',
  //       });
  //      connection.connect();
  //       connection.query("select * from chats where (uuid='"+uuid+"'and (fuser='"+fid+"' or fuser='"+tid+"') and (tuser='"+tid+"' or tuser = '"+fid+"'));", function(err, rows, fields) {
  //           if (err)
  //           { 
  //              myFuture.throw(err)
  //           }
  //           else {
  //              myFuture.return(rows);
  //           }
  //       });
  //        connection.end();
  //      return myFuture.wait();
  // },
  // 'insertChatMessages':function(fid,tid,uuid,message){
  //    var mysql = Meteor.npmRequire('mysql');
  //   Future = Npm.require('fibers/future');
  //   var myFuture = new Future();

  //       var connection = mysql.createConnection({
  //           host     : 'uploadimages.cbwgrfnpfxqv.us-west-2.rds.amazonaws.com',
  //           user     : 'root',
  //           password : '12345678',
  //           database : 'images',
  //       });
  //      connection.connect();
  //      connection.query("insert into chats (fuser,tuser,uuid,body) values('"+fid+"','"+tid+"','"+uuid+"','"+message+"');", function(err, rows, fields) {       
  //        if (err)
  //           { 
  //              myFuture.throw(err)
  //           }
  //           else {
             
  //              myFuture.return(rows);
  //           }
  //       });
  //        connection.end();
  //      return myFuture.wait();     

  // },
  'serverNotification': function(uMId, type){
        var title = "";
        if(type == "NEWQUESTION"){
            title = "You got a new question";
        } else if(type == "NEWANSWER"){
            title = "You got a new answer";
        } else if(type = "CHATREQUEST"){
            title = "Someone wants to chat with you"
        } else {
            title = "Your answer is chonsen as the best";
        }
        Push.debug = true;
        Push.send({
           from: 'push',
           title: title,
           text: title,
           badge: 1,
           payload: {
              title: title,
           },
           query: {
              userId: uMId
           },
           notId: Math.floor((Math.random() * 10000) + 1)
        });
        console.log("Done push notification to " + uMId);
    },

})