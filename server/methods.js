Meteor.methods({
  'deleteFile': function(_id) {
    check(_id, String);
// <<<<<<< HEAD

//     var upload = Uploads.findOne(_id);
//     if (upload == null) {
//       throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
//     }

//     UploadServer.delete(upload.path);
//     Uploads.remove(_id);
// =======

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
    Future = Npm.require('fibers/future');
    var myFuture = new Future();

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
        connection.query("insert into imgCamera (img64,uuid) values('"+imgData+"',"+"'"+uuid+"');", function(err, rows, fields) {
            if (err)
            {
               myFuture.throw(err)
            }
            else {
               myFuture.return(rows);
            }
        });
      })
         connection.end();
       return myFuture.wait();
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
        connection.query("select * from imgCamera where uuid='"+uuid+"';", function(err, rows, fields) {
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

    'serverNotification': function(uMId, type){
        var title = "";
        if(type == "NEWQUESTION"){
            title = "You got a new question";
        } else if(type == "NEWANSWER"){
            title = "You got a new answer";
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
           }
        });
        console.log("Done push notification to " + uMId);
    },
})